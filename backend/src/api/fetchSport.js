import { executeWithDetailedHandling, NotFoundError } from "../utils/executionHandler.js";
import DateFormatter from "../utils/dateFormatter.js";
import RequestBuilder from "../utils/requestBuilder.js";

const sports = [
    "football",
    "basketball",
    "ice-hockey",
    "esports",
    "handball",
    "american-football",
    "volleyball",
    "baseball"
]

class SportFetcher {
    constructor(team, gender='M') {
        this.team = team;
        this.gender = gender;
        this.sport = sports;
    }

    async fetchTeam(team, sports, gender) {
        return executeWithDetailedHandling(async () => {
            const params = {
                'q': team
            }

            const response = await RequestBuilder.get('https://www.sofascore.com/api/v1/search/all')
                            .setParams(params)
                            .send();
        
            if (!response.success) throw new NotFoundError("Error fetching team.");

            let results = response.data.results.filter((result) => result.type === 'team' && sports.includes(result.entity.sport.slug));

            if (gender.toUpperCase() === 'M') {
                results = results.filter((result) => result.entity.gender === 'M');
            } else if (gender.toUpperCase() === 'F') {
                results = results.filter((result) => result.entity.gender === 'F');
            }

            return results[0].entity;
        });
    }

    extractTeamData(team) {
        const extraction = {
            'id': team.id,
            'name': team.name,
            'shortName': team.shortName,
            'gender': team.gender,
            'color': team.teamColors.primary
        }

        return extraction;
    }


    async fetchLastMatches(teamId) {
        return executeWithDetailedHandling(async () => {
            const response = await RequestBuilder.get(`https://www.sofascore.com/api/v1/team/${teamId}/events/last/0`)
                            .send();

            if (!response.success) throw new NotFoundError("Error fetching last match.");

            if ((this.extractMatchData(response.data.events[response.data.events.length - 1])).live) response.data.events.pop();

            return response.data.events;
        });
    }

    async fetchNextMatches(teamId) {
        return executeWithDetailedHandling(async () => {
            const response = await RequestBuilder.get(`https://www.sofascore.com/api/v1/team/${teamId}/events/next/0`)
                            .send();

            if (!response.success) throw new NotFoundError("Error fetching next match.");

            return response.data.events;
        });
    }

    async fetchLiveMatch(teamId) {
        return executeWithDetailedHandling(async () => {
            const response = await RequestBuilder.get(`https://www.sofascore.com/api/v1/team/${teamId}/events/last/0`)
                            .send();

            if (!response.success) throw new NotFoundError("Error fetching current live match.");

            const liveMatch = (this.extractMatchData(response.data.events[response.data.events.length - 1])).live ? response.data.events[response.data.events.length - 1] : null;
        
            return liveMatch;
        });
    }

    extractMatchData(match) {
        if (match) {
            const isEmpty = (object) => Object.keys(object).length === 0;

            const homeTeam = match.homeTeam;
            const awayTeam = match.awayTeam;
            const homeScore = !isEmpty(match.homeScore) ? match.homeScore.current : 0;
            const awayScore = !isEmpty(match.awayScore) ? match.awayScore.current : 0;
    
            const extraction = {
                'live': match.status.type === 'inprogress',
                'start': DateFormatter.getDateTime(true, match.startTimestamp * 1000),
                'homeTeam': homeTeam.shortName,
                'awayTeam': awayTeam.shortName,
                'homeScore': homeScore,
                'awayScore': awayScore
            }
            
            return extraction;
        }
    }
    
    // async fetchTeamStanding(teamId, tournamentId) {
    //     return executeWithDetailedHandling(async () => {
    //         const lastPlayedMatches = (await this.fetchLastMatches(teamId)).data
    //         const lastFetchableMatch = (await this.fetchLiveMatch(teamId)).data ? (await this.fetchLiveMatch(teamId)).data : lastPlayedMatches[lastPlayedMatches.length - 1];

    //         const tournamentId = lastFetchableMatch.tournament.uniqueTournament.id;
    //         const seasonId = lastFetchableMatch.season.id;

    //         const response = await RequestBuilder.get(`https://www.sofascore.com/api/v1/unique-tournament/${tournamentId}/season/${seasonId}/standings/total`)
    //                         .send();

    //         return response.data.standings;
    //     })
    // }

    // extractTeamStandingData(standing, teamId) {
    //     const position = (standing.rows.filter((row) => row.team.id === parseInt(teamId)))[0].position;

    //     const extraction = {
    //         'league': standing.tournament.uniqueTournament.name,
    //         'teams': standing.rows.length,
    //         'position': position
    //     }

    //     return extraction;
    // }

    async handleStatistics(team, sports, gender) {
        return executeWithDetailedHandling(async () => {
            const teamInformation = (await this.fetchTeam(team, sports, gender)).data;
            const teamInformationData = this.extractTeamData(teamInformation);
            const teamId = teamInformationData.id;

            const [ lastMatches, liveMatch, nextMatches ] = await Promise.all([
                // this.fetchTeamStanding(teamId), 
                this.fetchLastMatches(teamId), 
                this.fetchLiveMatch(teamId), 
                this.fetchNextMatches(teamId)
            ]);

            const [ lastMatchData, liveMatchData, nextMatchData ] = await Promise.all([
                // this.extractTeamStandingData(teamStanding.data, teamId), 
                this.extractMatchData(lastMatches.data[lastMatches.data.length - 1]), 
                this.extractMatchData(liveMatch.data), 
                this.extractMatchData(nextMatches.data[0])
            ]);

            const data = {
                'team': teamInformationData,
                //'standing': teamStandingData,
                'lastMatch': lastMatchData,
                'liveMatch': liveMatchData || null,
                'nextMatch': nextMatchData
            }

            return data;
        });
    }

    async getStatistics() {
        return executeWithDetailedHandling(async () => {
            const statistics = (await this.handleStatistics(this.team, this.sport, this.gender)).data;
            if (!statistics) throw new NotFoundError("Failed fetching Sport Statistics.");
            return statistics;
        });
    }
}

export default SportFetcher;