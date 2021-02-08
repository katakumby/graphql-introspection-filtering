import { makeExecutableSchema } from 'graphql-tools';
import Manager from '../classes/Manager';
import { INTROSPECTION_VISITOR_METHODS } from '../constants';

import type { GraphQLSchema } from 'graphql';
import type { IExecutableSchemaDefinition } from 'graphql-tools';
import type { SchemaDirectiveVisitor } from 'graphql-tools';
import type { BuilderSig, IntrospectionDirectiveVisitorStatic } from '../types';


const filterIntrospectionDirectives = (directives: Record<string, IntrospectionDirectiveVisitorStatic | typeof SchemaDirectiveVisitor>) => {
    const filtered: Record<string, IntrospectionDirectiveVisitorStatic> = {};
    for (const [name, directive] of Object.entries(directives)) {
        if (INTROSPECTION_VISITOR_METHODS.some((method) => !!directive.prototype[method]))
            filtered[name] = directive as IntrospectionDirectiveVisitorStatic;
    }

    return filtered;
};

export default <TContext = any>(
    config: IExecutableSchemaDefinition<TContext>,
    builder: BuilderSig<TContext> = makeExecutableSchema
): GraphQLSchema => {
    const schema = builder(config);
    if (config.schemaDirectives) {
        Manager.inject(new Manager(filterIntrospectionDirectives(config.schemaDirectives), schema));
    }
    return schema;
};
