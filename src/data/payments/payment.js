export const paymentMethods = [
    {
        id: 'pay-at-hotel',
        label: 'Pay at Hotel',
        desc: 'Pay when you arrive at hotel',
        available: true,
    },
    {
        id: 'online-payment',
        label: 'Online Payment',
        desc: 'Coming soon',
        available: true,
    },
];

export const paymentBookingSteps = [
    {
        id:'guest',
        number:1,
        label:'Guest Info'
    },
    {
        id:'payment',
        number:2,
        label:'Payment'
    },
    {
        id:'confirmation',
        number:'3',
        label:'Confirmation'
    },
];


export const defaultAdvancePayment = 5000;