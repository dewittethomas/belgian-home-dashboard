import { executeWithDetailedHandling, NotFoundError } from "../helpers/execute_helper.js";
import RequestBuilder from "../utils/request_builder.js";

class FootballFetcher {
    constructor(team) {
        this.team = team;
    }

    async fetchTeam(query, gender='') {
        return await executeWithDetailedHandling(async () => {
            let results;
            
            const params = {
                'q': query
            }

            const response = await RequestBuilder.get('https://www.sofascore.com/api/v1/search/all')
                            .setParams(params)
                            .send();
        
            if (!response.success) {
                throw new NotFoundError("Error fetching team.");
            }

            if (gender.toUpperCase() === 'M') {
                results = response.data.results.filter((result) => result.type === 'team' && result.entity.gender === 'M');
            } else if (gender.toUpperCase() === 'F') {
                results = response.data.results.filter((result) => result.type === 'team' && result.entity.gender === 'F');
            } else {
                results = response.data.results.filter((result) => result.type === 'team');
            }

            return { data: results };
        });
    }
}

export default FootballFetcher;