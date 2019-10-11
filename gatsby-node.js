const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

exports.createResolvers = ({
  actions,
  cache,
  createNodeId,
  createResolvers,
  store,
  reporter,
}, configOptions) => {
  const { createNode } = actions;

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins;

  //const imageUrlFieldName = "imageUrl";
  const imageUrlFieldName = configOptions.imageFieldName;
  //const schemaName = "MUMDANCE";
  const schemaName = configOptions.schemaName;

  const state = store.getState();
  const schema = state.schemaCustomization.thirdPartySchemas.filter(s => s._typeMap[schemaName])[0]

  if (!schema){
    throw new Error(`SCHEMA '${schemaName} NOT FOUND'`)
  } else{
    console.log(`Found schema '${schemaName}', traversing for fields with name '${imageUrlFieldName}'`)
  }

  const typeMap = schema._typeMap;
  const resolvers = {};

  for (const typeName in typeMap) {
    const typeEntry = typeMap[typeName];
    const typeFields = (typeEntry && typeEntry.getFields && typeEntry.getFields()) || {};
    const typeResolver = {};
    for (const fieldName in typeFields) {
      const field = typeFields[fieldName];

      if (fieldName === imageUrlFieldName){
        typeResolver[`${fieldName}Sharp`] = {
          type: 'File',
          resolve(source) {
            const url = source[imageUrlFieldName];
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