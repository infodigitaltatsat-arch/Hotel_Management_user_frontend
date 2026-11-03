export const roomTypeFilters = [
    {id:"single",label:"Single"},
    {id:"double",label:"Double"},
     {id:"suite",label:"Suite"},
      {id:"deluxe",label:"Deluxe"},
];

export const amenityFilters = [
    {id:'wifi',label:"W-Fi",keyword:["wi-fi","wifi"]},
    {id:'ac',label:"AC",keyword:["air conditioning"]},
    {id:'work-desk',label:"Work Desk",keyword:["work desk"]},
    {id:'sitting-area',label:"Sitting Area",keyword:["sitting area"]},
];

export const priceFilter = {
    min:0,
    max:20000,
    step:500,
};

export const getRoomType = (room) =>{
    const roomName = `${room.name} ${room.id}`.toLocaleLowerCase();

    if(roomName.includes("suite")) return "suite";
    if(roomName.includes("deluxe")) return "deluxe";

     if(roomName.includes("executive")) return "deluxe";

     return 'single';
};


export const hasAmenity = (room,filter)=>{
    const roomAmenities = (room.amenities || []).map((amenity)=>amenity.toLocaleLowerCase());
    
    return filter.keywords.some((keyword)=>roomAmenities.some((amenity)=>amenity.includes(keyword)));
};