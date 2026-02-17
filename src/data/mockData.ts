export const siteData = {
    general: {
        name: "Contegroup",
        slogan: "Vendita e Noleggio Escavatori",
        email: "info@contegroup.it",
        phone: "+39 123 456 7890",
        address: "Via Roma 1, 00100 Roma"
    },
    excavators: [
        {
            id: "1",
            name: "Caterpillar 320 GC",
            description: "Escavatore cingolato affidabile e performante. Ideale per cantieri di medie e grandi dimensioni.",
            weight: 20.5,
            price: 85000,
            condition: "NUOVO",
            images: ["https://s7d2.scene7.com/is/image/Caterpillar/CM20180404-36526-28267"],
            features: ["Aria Condizionata", "Attacco Rapido", "Benna Scavo", "Impianto Martello"],
            serialNumber: "CAT320GC-001",
            year: 2021,
            hours: 1200,
            type: "sale"
        },
        {
            id: "2",
            name: "Bobcat E19",
            description: "Miniescavatore compatto per spazi ristretti. Versatile e potente.",
            weight: 1.9,
            price: 120, // Daily rental price
            condition: "OTTIME CONDIZIONI",
            images: ["https://assets.bobcat.com/is/image/Doosan/E19_Hero?wid=1600"],
            features: ["Carro Allargabile", "Tettuccio", "3 Benne"],
            serialNumber: "BOB-E19-88",
            year: 2023,
            hours: 450,
            type: "rent"
        }
    ]
};
