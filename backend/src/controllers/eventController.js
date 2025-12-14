const ticketmasterService=require('../services/ticketmasterService');

async function listEvents(req,res){
    try{
        const {q,city,page}=req.query;
        const events=await ticketmasterService.searchEvents({
            keyword:q,
            city,
            page
        });
        res.json({success:true,events});  
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }
}

async function getEvent(req,res){
    try{
        const {id}=req.params;
        const event=await ticketmasterService.getEventById(id);
        res.json({success:true,event});
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }
}

module.exports={listEvents,getEvent};