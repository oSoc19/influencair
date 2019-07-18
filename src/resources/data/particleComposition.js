const compositionTypes = [
    {
        name: 'Elementary carbon',
        amount: 4,
        color: '#OOOOOO'
    },
    {
        name: 'Organic matter',
        amount: 20,
        color: '#68ad0e'
    },
    {
        name: 'Sea salt',
        amount: 8,
        color: '#e3deba'
    },
    {
        name: 'Nitrate',
        amount: 21,
        color: '#e8cd1a'
    },
    {
        name: 'Ammonium',
        amount: 7,
        color: '#39e69e'
    },
    {
        name: 'Sulphate',
        amount: 12,
        color: '#1791e8'
    },
    {
        name: 'Soil dust',
        amount: 14,
        color: '#9e6b28'
    },
    {
        name: 'Others',
        amount: 14,
        color: '#de2170'
    },
]

for (let index = 0, prev = 0; index < compositionTypes.length; index++) {
    compositionTypes[index].barChart = {
        start: prev,
        mid: prev + (compositionTypes[index].amount / 2),
        end: prev + compositionTypes[index].amount
    }
    prev = prev + compositionTypes[index].amount
}

export default compositionTypes
