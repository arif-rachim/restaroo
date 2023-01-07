import {Menu, Product} from "./Product";


export const products: Product[] = [
    {
        id: 'tahu-gejrot-cirebon',
        name: 'Tahu Gejrot Cirebon',
        isVegan: true,
        price: 25,
        discount: 0,
        currency: 'AED',
        description: 'Sumedang tofu with spicy, sweet and sour sauce made from palm sugar and tamarind.',
        servesFor: 1,
        image: '/assets/product/tahu-gejrot-cirebon.jpeg',
        configs: []
    },
    {
        id: 'gorengan-tempe-mendoan',
        name: 'Gorengan Tempe Mendoan',
        isVegan: true,
        price: 17,
        discount: 0,
        currency: 'AED',
        description: 'Three pieces of friend tempe.',
        servesFor: 1,
        image: '/assets/product/gorengan-tempe-mendoan.jpeg',
        configs: []
    },
    {
        id: 'gorengan-bakwan-sayur',
        name: 'Gorengan Bakwan Sayur',
        isVegan: true,
        price: 17,
        discount: 0,
        currency: 'AED',
        description: 'Three pieces of vegetables fritters',
        servesFor: 1,
        image: '/assets/product/gorengan-bakwan-sayur.jpeg',
        configs: []
    },
    {
        id: 'gorengan-tahu-isi',
        name: 'Gorengan Tahu Isi',
        isVegan: true,
        price: 17,
        discount: 0,
        currency: 'AED',
        description: 'Three pieces of stuffed tofu.',
        servesFor: 1,
        image: '/assets/product/gorengan-tahu-isi.jpeg',
        configs: []
    },
    {
        id: 'gorengan-bakwan-jagung',
        name: 'Gorengan Bakwan Jagung',
        isVegan: true,
        price: 17,
        discount: 0,
        currency: 'AED',
        description: 'Bakwan Jagung nonull corn fritters, is a simple yet delicious Indonesian deep fried snack that\'s perfect asa side dish nonull for teatime',
        servesFor: 1,
        image: '/assets/product/gorengan-bakwan-jagung.jpeg',
        configs: []
    },
    {
        id: 'gorengan-mix',
        name: 'Gorengan Mix',
        isVegan: true,
        price: 17,
        discount: 0,
        currency: 'AED',
        description: 'Can\'t decide which gorengan to have? Choose 3 out of 4 types of gorengans',
        servesFor: 1,
        image: '/assets/product/gorengan-mix.jpeg',
        configs: [
            {
                name: 'Gorengan Types',
                maximumSelection: 3,
                required: true,
                options: [
                    {
                        name: 'Tahu Isi',
                        isVegan: true,
                        price: 0
                    },
                    {
                        name: 'Tempe Mendoan',
                        isVegan: true,
                        price: 0
                    },
                    {
                        name: 'Bakwan Sayur',
                        isVegan: true,
                        price: 0
                    },
                    {
                        name: 'Bakwan Jagung',
                        isVegan: true,
                        price: 0
                    }
                ]
            }
        ]
    },
    {
        id: 'pempek-palembang',
        name: 'Pempek palembang',
        isVegan: true,
        price: 37,
        discount: 0,
        currency: 'AED',
        description: 'Crispy fish cake with egg noodle, chopped cucumber, served in sweet and sour sauce made from palm sugar and tamarind',
        servesFor: 1,
        image: '/assets/product/pempek-palembang.jpeg',
        configs: []
    },
    {
        id: 'siomay-bandung',
        name: 'Siomay Bandung',
        isVegan: true,
        price: 34,
        discount: 0,
        currency: 'AED',
        description: 'Steamed fish cake with tofu, boiled potato, bitter gourd and steamed cabbage with peanut sauce',
        servesFor: 1,
        image: '/assets/product/siomay-bandung.jpeg',
        configs: []
    },
    {
        id: 'gado-gado',
        name: 'Gado-Gado',
        isVegan: true,
        price: 29,
        discount: 0,
        currency: 'AED',
        description: 'Indonesian mix vegetable salad with peanut dressing and crackers',
        servesFor: 1,
        image: '/assets/product/gado-gado.jpeg',
        configs: []
    },
    {
        id: 'martabak-telor',
        name: 'Martabak Telor',
        isVegan: true,
        price: 42,
        discount: 0,
        currency: 'AED',
        description: 'Indonesian stuffed savory pancakes filled with savory egg-beef mix and curry spices served with pickle.',
        servesFor: 1,
        image: '/assets/product/martabak-telor.jpeg',
        configs: []
    },/// THIS IS WHERE THE MAIN COURSE BEGIN
    {
        id: 'seafood-bakar-platter',
        name: 'Seafood Bakar Platter',
        isVegan: false,
        price: 149,
        discount: 0,
        currency: 'AED',
        description: 'Package of squid, shrimp, clams and mussles charcoal-grilled served with unlimited rice, spicy chili paste and sambal matah - Good for 2-3 persons.',
        servesFor: 2,
        image: '/assets/product/seafood-bakar-platter.jpeg',
        configs: [
            {
                name: 'Style',
                required: true,
                maximumSelection: 1,
                options: [
                    {
                        name: 'In Balinese Style',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'With Padangnese Sauce',
                        isVegan: false,
                        price: 0
                    }
                ]
            }
        ]
    },
    {
        id: 'nasi-padang',
        name: 'Nasi Padang',
        isVegan: false,
        price: 42,
        discount: 0,
        currency: 'AED',
        description: 'White rice, served with tender jackfruit curry, steamed green vegetables, spicy egg, chili green paste with cow feet curry.',
        servesFor: 1,
        image: '/assets/product/nasi-padang.jpeg',
        configs: [{
            name: 'Sides',
            required: true,
            maximumSelection: 1,
            options: [
                {
                    name: 'With Gulai Tunjang',
                    isVegan: false,
                    price: 3
                },
                {
                    name: 'With Dendeng Balado',
                    isVegan: false,
                    price: 2
                },
                {
                    name: 'With Gulai Ayam (Breast)',
                    isVegan: false,
                    price: 0
                },
                {
                    name: 'Gulai Ayam (Thigh)',
                    isVegan: false,
                    price: 0
                },
                {
                    name: 'Rendang Daging',
                    isVegan: false,
                    price: 6
                }
            ]
        }]
    },
    {
        id: 'sate-ayam-madura',
        name: 'Sate Ayam Madura',
        isVegan: true,
        price: 45,
        discount: 0,
        currency: 'AED',
        description: 'Charcoal grilled chicken skewer with rice cake, peanut sauce and pickle',
        servesFor: 1,
        image: '/assets/product/sate-ayam-madura.jpeg',
        configs: []
    },
    {
        id: 'sate-kambing-khas-solo',
        name: 'Sate Kambing Khas Solo',
        isVegan: false,
        price: 58,
        discount: 0,
        currency: 'AED',
        description: 'Charcoal grilled lamb skewer, Solonese style with rice cake, peanut sauce and pickle',
        servesFor: 1,
        image: '/assets/product/sate-kambing-khas-solo.jpeg',
        configs: []
    },
    {
        id: 'sate-padang',
        name: 'Sate Padang',
        isVegan: false,
        price: 43,
        discount: 0,
        currency: 'AED',
        description: 'Charcoal-grilled beef skewer served with rice cake and spicy cassava chips with aromatic curry gravy',
        servesFor: 1,
        image: '/assets/product/sate-padang.jpeg',
        configs: [
            {
                name: 'Meat',
                required: true,
                maximumSelection: 1,
                options: [
                    {
                        name: 'Beef',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Ox Tongue',
                        isVegan: false,
                        price: 5
                    }, {
                        name: 'Mixed Beef and Ox Tongue',
                        isVegan: false,
                        price: 2
                    }
                ]
            }
        ]
    },
    {
        id: 'mie-dukduk',
        name: 'Mie Dukduk',
        isVegan: false,
        price: 38,
        discount: 0,
        currency: 'AED',
        description: 'Indonesian style stir fried homemade egg noodle with seafood, meatball, vegetables and egg',
        servesFor: 1,
        image: '/assets/product/mie-dukduk.jpeg',
        configs: [
            {
                name: 'Meat',
                required: true,
                maximumSelection: 1,
                options: [
                    {
                        name: 'Seafood',
                        isVegan: false,
                        price: 4
                    },
                    {
                        name: 'Chicken',
                        isVegan: false,
                        price: 0
                    }
                ]
            },
            {
                name: 'Spicy level',
                required: true,
                maximumSelection: 1,
                options: [
                    {
                        name: 'Not Spicy',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Mild',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Hot',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Separate Chili',
                        isVegan: false,
                        price: 0
                    }
                ]
            }
        ]
    },
    {
        id: 'nasi-goreng-spesial',
        name: 'Nasi Goreng Spesial',
        isVegan: false,
        price: 43,
        discount: 0,
        currency: 'AED',
        description: 'Indonesian style fried rice, served with chicken satay, shredded chicken, meatball, egg, shrimp crackers and pickle',
        servesFor: 1,
        image: '/assets/product/nasi-goreng-spesial.jpeg',
        configs: [
            {
                name: 'Spicy level',
                required: true,
                maximumSelection: 1,
                options: [
                    {
                        name: 'Not Spicy',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Mild',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Hot',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Separate Chili',
                        isVegan: false,
                        price: 0
                    }
                ]
            }
        ]
    },
    {
        id: 'mie-ayam-jamur',
        name: 'Mie Ayam Jamur',
        isVegan: false,
        price: 37,
        discount: 0,
        currency: 'AED',
        description: 'Freshly homemadre egg noodle, served with green mustard, meat ball, fried dumpling, chicken and mushroom topping',
        servesFor: 1,
        image: '/assets/product/mie-ayam-jamur.jpeg',
        configs: []
    },
    {
        id: 'ayam-bakar-kalasan',
        name: 'Ayam Bakar Kalasan',
        isVegan: false,
        price: 35,
        discount: 0,
        currency: 'AED',
        description: 'Crispy grilled chicken with sweet soy sauce, served with rice, salad and chili paste',
        servesFor: 1,
        image: '/assets/product/ayam-bakar-kalasan.jpeg',
        configs: [{
            name: 'Meat',
            required: true,
            maximumSelection: 1,
            options: [
                {
                    name: 'Any',
                    isVegan: false,
                    price: 0
                },
                {
                    name: 'Breast',
                    isVegan: false,
                    price: 0
                },
                {
                    name: 'Thigh',
                    isVegan: false,
                    price: 0
                }
            ]

        }]
    },
    {
        id: 'internet',
        name: 'Internet',
        isVegan: false,
        price: 42,
        discount: 0,
        currency: 'AED',
        description: 'Indonesian pride instant noodle with poached egg, beef corned and cheddar cheese.',
        servesFor: 1,
        image: '/assets/product/internet.jpeg',
        configs: [
            {
                name: 'Type',
                required: true,
                maximumSelection: 1,
                options: [
                    {
                        name: 'Fried',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Soupy',
                        isVegan: false,
                        price: 0
                    }
                ]
            },
            {
                name: 'Spicy level',
                required: true,
                maximumSelection: 1,
                options: [
                    {
                        name: 'Not Spicy',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Mild',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Hot',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Separate Chili',
                        isVegan: false,
                        price: 0
                    }
                ]
            }
        ]
    },
    {
        id: 'ayam-bakar-taliwang',
        name: 'Ayam Bakar Taliwang',
        isVegan: false,
        price: 38,
        discount: 0,
        currency: 'AED',
        description: 'Spicy Indonesian charcoal-grilled chicken originated from Taliwang in West Nusa Tenggara, Indonesia. Served with rice wrapped in banana leaf, plecing kangkung, fried tempe and tofu and spicy chili paste',
        servesFor: 1,
        image: '/assets/product/ayam-bakar-taliwang.jpeg',
        configs: [
            {
                name: 'Meat',
                required: true,
                maximumSelection: 1,
                options: [
                    {
                        name: 'Any',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Breast',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Thigh',
                        isVegan: false,
                        price: 0
                    }
                ]

            }
        ]
    },
    {
        id: 'sup-buntut-rempah',
        name: 'Sup Buntut Rempah',
        isVegan: false,
        price: 48,
        discount: 0,
        currency: 'AED',
        description: 'Oxtail clear soup with gnemon crackers, pickle and chili paste, served with white rice.',
        servesFor: 1,
        image: '/assets/product/sup-buntut-rempah.jpeg',
        configs: [
            {
                name: 'Oxtail Soup Type',
                required: true,
                maximumSelection: 1,
                options: [
                    {
                        name: 'Normal',
                        isVegan: false,
                        price: 0
                    }, {
                        name: 'Grilled',
                        isVegan: false,
                        price: 0
                    }
                ]
            },
            {
                name: 'Spicy level',
                required: true,
                maximumSelection: 1,
                options: [
                    {
                        name: 'Not Spicy',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Mild',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Hot',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Separate Chili',
                        isVegan: false,
                        price: 0
                    }
                ]
            }
        ]
    },
    {
        id: 'ayam-penyet',
        name: 'Ayam Penyet',
        isVegan: false,
        price: 36,
        discount: 0,
        currency: 'AED',
        description: 'Fried chicken that is smashed with the pestle against mortar to make it softer, served with white rice, sambal, vegetables, fried tofu and tempe.',
        servesFor: 1,
        image: '/assets/product/ayam-penyet.jpeg',
        configs: [
            {
                name: 'Meat',
                required: true,
                maximumSelection: 1,
                options: [
                    {
                        name: 'Any',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Breast',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Thigh',
                        isVegan: false,
                        price: 0
                    }
                ]

            },
            {
                name: 'Spicy level',
                required: true,
                maximumSelection: 1,
                options: [
                    {
                        name: 'Not Spicy',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Mild',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Hot',
                        isVegan: false,
                        price: 0
                    },
                    {
                        name: 'Separate Chili',
                        isVegan: false,
                        price: 0
                    }
                ]
            }
        ]
    },
    {
        id: 'konro-bakar-makasar',
        name: 'Konro Bakar Makasar',
        isVegan: false,
        price: 59,
        discount: 0,
        currency: 'AED',
        description: 'Char grilled BBQ short ribs with peanut and steamed rice in Makassar\'s style',
        servesFor: 1,
        image: '/assets/product/konro-bakar-makasar.jpeg',
        configs: []
    },
    {
        id: 'es-kopi-luwak',
        name: 'Es Kopi Luwak',
        isVegan: false,
        price: 25,
        discount: 0,
        currency: 'AED',
        description: 'Kopi luwak is the world\'s most exclusive and most expensive coffee. The main factor of its high price is its unique method production',
        servesFor: 1,
        image: '/assets/product/es-kopi-luwak.jpeg',
        configs: []
    },
    {
        id: 'bir-pletok-betawi',
        name: 'Bir Pletok Betawi',
        isVegan: false,
        price: 25,
        discount: 0,
        currency: 'AED',
        description: 'Non alcoholic traditional drink of Indonesia. Made from several spices namely ginger, pandan leaves, boiled sappan wood, and lemongrass',
        servesFor: 1,
        image: '/assets/product/bir-pletok-betawi.jpeg',
        configs: [
            {
                name: 'Hot nonull Cold',
                maximumSelection: 1,
                required: true,
                options: [
                    {
                        name: 'Cold',
                        isVegan: true,
                        price: 0
                    },
                    {
                        name: 'Less Ice',
                        isVegan: true,
                        price: 0
                    },
                    {
                        name: 'No Ice',
                        isVegan: true,
                        price: 0
                    },
                    {
                        name: 'Hot',
                        isVegan: true,
                        price: 0
                    }
                ]
            }
        ]
    },
    {
        id: 'es-teler-rempah',
        name: 'Es Teler Rempah',
        isVegan: false,
        price: 30,
        discount: 0,
        currency: 'AED',
        description: 'Mix avocado, coconut and jackfruit, served with sweetened condensed milk and crushed ice',
        servesFor: 1,
        image: '/assets/product/es-teler-rempah.jpeg',
        configs: [
            {
                name: 'Hot nonull Cold',
                maximumSelection: 1,
                required: true,
                options: [
                    {
                        name: 'Cold',
                        isVegan: true,
                        price: 0
                    },
                    {
                        name: 'Less Ice',
                        isVegan: true,
                        price: 0
                    },
                    {
                        name: 'No Ice',
                        isVegan: true,
                        price: 0
                    },
                    {
                        name: 'Hot',
                        isVegan: true,
                        price: 0
                    }
                ]
            }
        ]
    }

]

export const menus: Menu[] = [
    {
        name: 'Appetizer', id: 'appetizer', productId: [
            'tahu-gejrot-cirebon',
            'gorengan-tempe-mendoan', 'gorengan-bakwan-sayur', 'gorengan-tahu-isi', 'gorengan-bakwan-jagung', 'gorengan-mix',
            'pempek-palembang', 'siomay-bandung', 'gado-gado', 'martabak-telor'
        ]
    },
    {
        name: 'Main Course', id: 'main-course', productId: [
            'seafood-bakar-platter',
            'nasi-padang',
            'sate-ayam-madura',
            'sate-kambing-khas-solo',
            'sate-padang',
            'mie-dukduk',
            'nasi-goreng-spesial',
            'mie-ayam-jamur',
            'ayam-bakar-kalasan',
            'internet',
            'ayam-bakar-taliwang',
            'sup-buntut-rempah',
            'ayam-penyet',
            'konro-bakar-makasar'
        ]
    },
]