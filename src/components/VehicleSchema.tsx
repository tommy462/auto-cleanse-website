import { Helmet } from 'react-helmet-async';

const MAKES_AND_MODELS = [
    // Ford
    'Ford Transit', 'Ford Transit Custom', 'Ford Transit Connect', 'Ford Ranger', 'Ford Focus', 'Ford Mondeo', 'Ford Kuga', 'Ford Fiesta', 'Ford Galaxy', 'Ford S-Max',
    // Vauxhall / Opel
    'Vauxhall Vivaro', 'Vauxhall Movano', 'Vauxhall Combo', 'Vauxhall Insignia', 'Vauxhall Astra', 'Vauxhall Corsa', 'Vauxhall Zafira', 'Vauxhall Mokka',
    // Volkswagen (VW)
    'VW Transporter', 'VW T5', 'VW T6', 'VW Crafter', 'VW Caddy', 'VW Golf', 'VW Passat', 'VW Tiguan', 'VW Touareg', 'VW Amarok', 'VW Polo',
    // Mercedes-Benz
    'Mercedes Sprinter', 'Mercedes Vito', 'Mercedes Citan', 'Mercedes C-Class', 'Mercedes E-Class', 'Mercedes A-Class', 'Mercedes GLC', 'Mercedes GLE', 'Mercedes ML',
    // BMW
    'BMW 1 Series', 'BMW 3 Series', 'BMW 5 Series', 'BMW X3', 'BMW X5', 'BMW 320d', 'BMW 520d', 'BMW 120d', 'BMW X1',
    // Audi
    'Audi A3', 'Audi A4', 'Audi A5', 'Audi A6', 'Audi Q3', 'Audi Q5', 'Audi Q7',
    // Peugeot
    'Peugeot Boxer', 'Peugeot Expert', 'Peugeot Partner', 'Peugeot 308', 'Peugeot 508', 'Peugeot 3008', 'Peugeot 5008',
    // Citroën
    'Citroen Relay', 'Citroen Dispatch', 'Citroen Berlingo', 'Citroen C3', 'Citroen C4', 'Citroen C5',
    // Renault
    'Renault Master', 'Renault Trafic', 'Renault Kangoo', 'Renault Megane', 'Renault Clio', 'Renault Captur',
    // Nissan
    'Nissan Navara', 'Nissan NV200', 'Nissan NV300', 'Nissan NV400', 'Nissan Qashqai', 'Nissan X-Trail',
    // Land Rover / Range Rover
    'Land Rover Discovery', 'Land Rover Defender', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar', 'Freelander 2',
    // Toyota
    'Toyota Hilux', 'Toyota Proace', 'Toyota RAV4', 'Toyota Land Cruiser', 'Toyota Avensis',
    // Volvo
    'Volvo XC60', 'Volvo XC90', 'Volvo V40', 'Volvo V60', 'Volvo V90', 'Volvo S60',
    // Fiat
    'Fiat Ducato', 'Fiat Scudo', 'Fiat Doblo', 'Fiat 500X', 'Fiat Tipo',
    // Skoda
    'Skoda Octavia', 'Skoda Superb', 'Skoda Kodiaq', 'Skoda Yeti', 'Skoda Fabia',
    // Seat
    'Seat Leon', 'Seat Ibiza', 'Seat Ateca', 'Seat Tarraco',
    // Jaguar
    'Jaguar XE', 'Jaguar XF', 'Jaguar F-Pace', 'Jaguar E-Pace',
    // Mazda
    'Mazda 3', 'Mazda 6', 'Mazda CX-5',
    // Honda
    'Honda CR-V', 'Honda Civic', 'Honda HR-V',
    // Kia
    'Kia Sportage', 'Kia Sorento', 'Kia Ceed',
    // Hyundai
    'Hyundai Tucson', 'Hyundai Santa Fe', 'Hyundai i30',
    // Mitsubishi
    'Mitsubishi L200', 'Mitsubishi Outlander', 'Mitsubishi Shogun',
    // Isuzu
    'Isuzu D-Max',
    // Porsche
    'Porsche Cayenne Diesel', 'Porsche Macan Diesel',
    // Commercial/HGV specific (General terms)
    'HGV', 'LGV', 'Truck', 'Lorry', 'Bus', 'Coach', 'Tractor', 'Agricultural Machinery', 'Plant Machinery', 'Excavator'
];

const VehicleSchema = () => {
    // Generate a massive Service schema catalog offering DPF cleaning for every single make and model
    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Professional DPF Cleaning Services",
        "provider": {
            "@type": "LocalBusiness",
            "name": "AutoCleanse DPF Specialists",
            "telephone": "08000430609",
            "url": "https://auto-cleanse.co.uk"
        },
        "serviceType": "Diesel Particulate Filter (DPF) Cleaning & Refurbishment",
        "areaServed": {
            "@type": "Country",
            "name": "United Kingdom"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "DPF Cleaning by Vehicle Make and Model",
            "itemListElement": MAKES_AND_MODELS.map((vehicle, index) => ({
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": `${vehicle} DPF Cleaning`
                },
                "position": index + 1
            }))
        }
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};

export default VehicleSchema;
