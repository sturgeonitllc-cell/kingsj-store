const Airtable = require('airtable');

exports.handler = async (event, context) => {
  try {
    const { method, table, data } = JSON.parse(event.body);
    
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
    
    let result;
    
    switch (method) {
      case 'GET':
        result = await base(table).select().firstPage();
        break;
      case 'POST':
        result = await base(table).create(data);
        break;
      case 'PUT':
        result = await base(table).update(data.id, data.fields);
        break;
      case 'DELETE':
        result = await base(table).destroy(data.id);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
