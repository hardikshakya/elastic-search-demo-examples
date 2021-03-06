const elasticsearch = require('elasticsearch');
const indexName = 'demo_elastic_index';
const query = 'Lewisham';

const searchData = async () => {
    const client = new elasticsearch.Client({
        host: 'localhost:9200',
    });
    await client.ping({
        requestTimeout: 3000
    }, (error) => {
        if (error) {
            console.trace('elasticsearch cluster is down!');
        } else {
            console.log('Elastic search is running.');
        }
    });
    try {
        const resp = await client.search({
            index: indexName,
            type: 'place',
            body: {
                sort: [
                    {
                        place_rank_num: { order: 'desc' },
                    },
                    {
                        importance_num: { order: 'desc' },
                    },
                ],
                query: {
                    bool: {
                        should: [{
                            match: {
                                lat: '51.4624325',
                            }
                            },{
                            match: {
                                alternative_names: query,
                            },
                        }]
                    },
                },
            },
        });
        const { hits } = resp.hits;
        console.log(hits);        
    } catch (e) {
        if (e.status === 404) {
            console.log('Index Not Found');
        } else {
            throw e;
        }
    }

}
searchData();