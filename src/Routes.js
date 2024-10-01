import React from "react";
import { Routes, Route } from "react-router-dom";
import {
FundingRoundCreate, FundingRoundEdit, FundingRoundView, 
FundingRoundList, 
InvestorCreate, InvestorEdit, InvestorView, 
Investors, 
StageCreate, StageEdit, StageView, 
Stages, 
StartupCreate, StartupEdit, StartupView, 
StartupTiles
} from "screens";

const Component = (props) => {

    return (
        <Routes>
            

                        
                                                        <Route path="FundingRounds/view/:id" element={<FundingRoundView {...props} title={'View FundingRound'} />} />
                        <Route path="FundingRounds/edit/:id" element={<FundingRoundEdit {...props} title={'Edit FundingRound'} />} />
                        <Route path="FundingRounds/create" element={<FundingRoundCreate {...props} title={'Create FundingRound'} />} />
                                            <Route path="Investors/view/:id" element={<InvestorView {...props} title={'View Investor'} />} />
                        <Route path="Investors/edit/:id" element={<InvestorEdit {...props} title={'Edit Investor'} />} />
                        <Route path="Investors/create" element={<InvestorCreate {...props} title={'Create Investor'} />} />
                                                                        <Route path="/" element={<Investors {...props} title={'Investor'} nolistbar={true} />} />
                                                                                            <Route path="Stages/view/:id" element={<StageView {...props} title={'View Stage'} />} />
                        <Route path="Stages/edit/:id" element={<StageEdit {...props} title={'Edit Stage'} />} />
                        <Route path="Stages/create" element={<StageCreate {...props} title={'Create Stage'} />} />
                                            <Route path="Startups/view/:id" element={<StartupView {...props} title={'View Startup'} />} />
                        <Route path="Startups/edit/:id" element={<StartupEdit {...props} title={'Edit Startup'} />} />
                        <Route path="Startups/create" element={<StartupCreate {...props} title={'Create Startup'} />} />

                <Route path="/FundingRound/list" element={<FundingRoundList {...props} title={'FundingRound List'} />} />
                <Route path="/investor" element={<Investors {...props} title={'Investor'} />} />
                <Route path="/stages" element={<Stages {...props} title={'Stages'} />} />
                <Route path="/startups/tiles" element={<StartupTiles {...props} title={'Startup'} />} />
        </Routes>
    )

};

export default Component;