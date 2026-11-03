import{
    Wifi,
    Wind,
    BriefcaseBusiness,
    Sofa,
    Sparkles,
} from 'lucide-react'


export const amenityIconMap = [
    {keywords:['wi-fi','wifi'],icon:Wifi},
    {keywords:['air conditioning'],icon:Wind},
    {keywords:['work desk'],icon:BriefcaseBusiness},
    {keywords:['sitting area'],icon:Sofa},
];

export const defaultAmenityIcon = Sparkles;

export const bookingSummaryLabels = {
    selectedDates: "Selected Dates",
    roomPrice: "Room Price",
    taxes: "Taxes & Fees",
    total: "Total Amount"
}