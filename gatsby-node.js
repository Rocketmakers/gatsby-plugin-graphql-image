const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

exports.createResolvers = ({
  actions: { createNode },
  cache,
  createNodeId,
  createResolvers,
  store,
  reporter,
}, {
  imageFieldName,
  imageFieldType,
  schemaName
}) => {
  const state = store.getState();
  const schema = state.schemaCustomization.thirdPartySchemas.filter(s => s._typeMap[schemaName])[0];

  if (!schema){
    throw new Error(`SCHEMA '${schemaName} NOT FOUND'`)
  } else{
    const filters = [imageFieldName ? `name '${imageFieldName}'`: null, imageFieldType ? `type '${imageFieldType}'`: null].filter(x => x).join(' or ');
    console.log(`Found schema '${schemaName}', traversing for fields with ${filters}`);
  }

  function shouldCreateNode(field) {
    if ((typeof imageFieldName === `string`) && (field.name === imageFieldName)) {
      return true;
    }
    if ((imageFieldName instanceof RegExp) && imageFieldName.test(field.name)) {
      return true;
    }

    const fieldType = String(field.type).substring(schemaName.length + 1);

    if ((typeof imageFieldType === `string`) && (fieldType === imageFieldType)) {
      return true;
    }
    if ((imageFieldType instanceof RegExp) && imageFieldType.test(fieldType)) {
      return true;
    }

    return false;
  }

  const typeMap = schema._typeMap;
  const resolvers = {};

  for (const typeName in typeMap) {
    const typeEntry = typeMap[typeName];
    const typeFields = (typeEntry && typeEntry.getFields && typeEntry.getFields()) || {};
    const typeResolver = {};
    for (const fieldName in typeFields) {
      const field = typeFields[fieldName];

      if (shouldCreateNode(field)){
        typeResolver[`${fieldName}Sharp`] = {
          type: 'File',
          resolve(source) {
            const url = source[fieldName];
            if (url) {
              return createRemoteFileNode({
                url,
                store,
                cache,
                createNode,
                createNodeId,
                reporter,
              });
            }
            return null;
          },
        };
      }
    }
    if (Object.keys(typeResolver).length) {
      resolvers[typeName] = typeResolver;
    }
  }

  if (Object.keys(resolvers).length) {
    createResolvers(resolvers);
  }
}
