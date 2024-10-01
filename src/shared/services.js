import Helper from "shared/helper";
import { apiUrl as serverApi } from "config";

const GetEntityInfo = async (name) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}${name}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}



 


	    
	 	
	
		
/* FundingRounds */

const GetFundingRoundsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}FundingRounds/$count`;
        if (query) url = `${serverApi}FundingRounds/$count?${query}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetFundingRoundsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}FundingRounds`;
        if (query) url = `${serverApi}FundingRounds?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetFundingRoundSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}FundingRounds(${id})`;
        if (params) {
            url = `${serverApi}FundingRounds(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetFundingRoundSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.RoundId;
        let method = "POST";
        let url = `${serverApi}FundingRounds`;
        if (input.RoundId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}FundingRounds(${input.RoundId})`;
        } else if (input.RoundId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}FundingRounds(${input.RoundId})`;
        }

        delete input['RoundId'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.RoundId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
   	   							// For Nested APIs
			/* $navPropName */

const SetFundingRoundInvestorsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, RoundId, InvestorId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}FundingRoundInvestorss`;
        let data = { InvestorId, RoundId: RoundId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}FundingRoundInvestorss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}FundingRoundInvestorss(${Id})`;
        }
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetFundingRoundInvestorsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}FundingRoundInvestorss?$filter=RoundId eq ${idValue}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   	   		
	
	    
	 	
	
		
/* Stages */

const GetStagesCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Stages/$count`;
        if (query) url = `${serverApi}Stages/$count?${query}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetStagesMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Stages`;
        if (query) url = `${serverApi}Stages?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetStageSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Stages(${id})`;
        if (params) {
            url = `${serverApi}Stages(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetStageSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.StageId;
        let method = "POST";
        let url = `${serverApi}Stages`;
        if (input.StageId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Stages(${input.StageId})`;
        } else if (input.StageId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Stages(${input.StageId})`;
        }

        delete input['StageId'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.StageId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
	
	
	    
           
 	
     


/* Document */ 
const SetDocumentSingleMedia = async (input, headers) => {     return new Promise(async (resolve) => {
        let id = headers.DocId;
        let method = "POST";
        let url = `${serverApi}Documents`;
                                                                delete headers['DocId'];
        delete headers['Deleted'];

        const formData = new FormData();
        formData.append('file', input);

        try {
            const res = await fetch(url, {
                method, body: formData,
                headers: {
                    ...headers
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.DocId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
const GetDocumentSingleMedia = async (id, value, type) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}Documents(${id})`;
        if (value) {
            url = `${serverApi}Documents(${id})/$value`;
        }

        try {
            const res = await fetch(url, {
                method: "GET"
            });

            if (res.status === 200) {
                let data = null;
                if (value) {
                    data = await res.text();
                    if (!Helper.IsNullValue(data)) {
                        if (data.startsWith("data:")) {
                            data = data.substring(data.indexOf('data:'));
                        } else {
                            let tmp = data.split('\r\n');
                            for (let img of tmp) {
                                if (img.startsWith("data:")) data = img;
                            }
                        }
                    }
                    return resolve({ status: res.ok, values: data });
                }
                data = await res.json();
                return resolve({ status: res.ok, values: data });
            }
            return resolve({ status: false, statusText: "Failed fetching data" });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

     
	        	
	
	
	    
	 	
	
		
/* Investors */

const GetInvestorsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Investors/$count`;
        if (query) url = `${serverApi}Investors/$count?${query}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetInvestorsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Investors`;
        if (query) url = `${serverApi}Investors?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetInvestorSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Investors(${id})`;
        if (params) {
            url = `${serverApi}Investors(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetInvestorSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.InvestorId;
        let method = "POST";
        let url = `${serverApi}Investors`;
        if (input.InvestorId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Investors(${input.InvestorId})`;
        } else if (input.InvestorId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Investors(${input.InvestorId})`;
        }

        delete input['InvestorId'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.InvestorId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
	
	
	    
	 	
	
		
/* Founders */

const GetFoundersCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Founders/$count`;
        if (query) url = `${serverApi}Founders/$count?${query}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetFoundersMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Founders`;
        if (query) url = `${serverApi}Founders?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetFounderSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Founders(${id})`;
        if (params) {
            url = `${serverApi}Founders(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetFounderSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.FId;
        let method = "POST";
        let url = `${serverApi}Founders`;
        if (input.FId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Founders(${input.FId})`;
        } else if (input.FId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Founders(${input.FId})`;
        }

        delete input['FId'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.FId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
	
	
	    
	 	
	
		
/* Startups */

const GetStartupsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Startups/$count`;
        if (query) url = `${serverApi}Startups/$count?${query}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetStartupsMulti = async (query, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Startups`;
        if (query) url = `${serverApi}Startups?${query}`;

        if (expands && query) url = `${url}&$expand=${expands}`;
        if (expands && !query) url = `${url}?$expand=${expands}`;
        
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetStartupSingle = async (id, params, expands) => {     return new Promise(async (resolve) => {

        let url = `${serverApi}Startups(${id})`;
        if (params) {
            url = `${serverApi}Startups(${id})?${params}`;
        }
        if (expands) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;
        
        try {
			const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetStartupSingle = async (input) => {     return new Promise(async (resolve) => {
        let id = input.SId;
        let method = "POST";
        let url = `${serverApi}Startups`;
        if (input.SId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Startups(${input.SId})`;
        } else if (input.SId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Startups(${input.SId})`;
        }

        delete input['SId'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.SId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}
     
	        	
   	   							// For Nested APIs
			/* $navPropName */

const SetStartupFoundersJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, SId, FId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}StartupFounderss`;
        let data = { FId, SId: SId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}StartupFounderss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}StartupFounderss(${Id})`;
        }
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetStartupFoundersJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}StartupFounderss?$filter=SId eq ${idValue}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   							// For Nested APIs
			/* $navPropName */

const SetStartupPreviousRoundsJoin = async (input) => {     return new Promise(async (resolve) => {
        
        const { Id, SId, RoundId, Deleted } = input;
        
        let method = "POST";
        let url = `${serverApi}StartupPreviousRoundss`;
        let data = { RoundId, SId: SId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}StartupPreviousRoundss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}StartupPreviousRoundss(${Id})`;
        }
        
        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetStartupPreviousRoundsJoin = async (idValue) => {     return new Promise(async (resolve) => {
        let url = `${serverApi}StartupPreviousRoundss?$filter=SId eq ${idValue}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

		                        	   		
	
 


// Below is a reference function - a possible business logic for ecom reference app
const GetProductStatus = async (productId) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}ProductOnBoardings?$filter=ProductId eq ${productId}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                let _tmp = { Status: '' };
                if (json.value && json.value.length > 0) {
                    _tmp = json.value[0];
                }
                return resolve({ status: res.ok, values: _tmp });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}




const GetMetaData = async () => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}$metadata`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });
            if (res.status === 200) {
                const values = await res.text();
                return resolve({ status: res.ok, values });
            }

            return resolve({ status: false, statusText: "Failed fetching data" });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

/* Prodict List View Details */
const GetProductOnBoardings = async () => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}ProductOnBoardings`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

export {
 GetEntityInfo,  GetFundingRoundsCount, GetFundingRoundsMulti, GetFundingRoundSingle, SetFundingRoundSingle, SetFundingRoundInvestorsJoin, GetFundingRoundInvestorsJoin, GetStagesCount, GetStagesMulti, GetStageSingle, SetStageSingle, SetDocumentSingleMedia, GetDocumentSingleMedia, GetInvestorsCount, GetInvestorsMulti, GetInvestorSingle, SetInvestorSingle, GetFoundersCount, GetFoundersMulti, GetFounderSingle, SetFounderSingle, GetStartupsCount, GetStartupsMulti, GetStartupSingle, SetStartupSingle, SetStartupFoundersJoin, GetStartupFoundersJoin, SetStartupPreviousRoundsJoin, GetStartupPreviousRoundsJoin, GetProductStatus, GetMetaData, GetProductOnBoardings
};
