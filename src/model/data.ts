import {Menu, Product} from "./Product";

const product:Product = {
    id : '123',
    name : 'Cheese Steak Burger Combo',
    isVegan : false,
    price : 16.8,
    discount : 0.2,
    currency:'AED',
    description : '100% All-beef chargrilled patty topped with philly cheeseteak melted American & Swiss cheese and mayo on our special toasted hardees sessame bun.',
    servesFor : 1,
    imageAddress : '182932.png',
    config : [
        {
            name : 'Fries',
            required : true,
            maximumSelection : 1,
            options : [
                {
                    name : 'Skin on Fries',
                    price : 1.5,
                    isVegan : true
                },
                {
                    name : 'Spicy Curly Fries',
                    price : 1,
                    isVegan : true
                },
                {
                    name : 'Spicy Skin Fries',
                    price : 1,
                    isVegan : true
                }
            ]
        },
        {
            name : 'Drink',
            maximumSelection : 1,
            required : true,
            options : [
                {
                    name:  'Pepsi',
                    price: 0,
                    isVegan: false
                },
                {
                    name:  '7 Up',
                    price: 0,
                    isVegan: false
                },
                {
                    name:  'Water',
                    price: 0,
                    isVegan: false
                },
                {
                    name:  'Large Pepsi',
                    price: 1,
                    isVegan: false
                },
                {
                    name:  'Large Mirinda',
                    price: 1,
                    isVegan: false
                }
            ]
        },
        {
            name : 'Add side item',
            required : false,
            maximumSelection : 1,
            options : [
                {
                    name: 'Large spicy fries',
                    isVegan: false,
                    price:  1
                },
                {
                    name: 'Cheese Topping',
                    isVegan: false,
                    price:  6
                },
                {
                    name: 'Cheese Steak Fries Topping',
                    isVegan: false,
                    price:  9
                }
            ]
        },
        {
            name : 'More condiments',
            required : false,
            maximumSelection : Infinity,
            options : [
                {
                    name: 'BBQ Sauce',
                    isVegan: false,
                    price:  2
                },
                {
                    name: 'Jalapeno Coins',
                    isVegan: false,
                    price:  2
                },
                {
                    name: 'Mushroom Sauce',
                    isVegan: false,
                    price:  2
                },
                {
                    name: 'American Cheese',
                    isVegan: false,
                    price:  2
                }
            ]
        }
    ]
}

export const products:Product[] = Array.from({length:50}).map((_,index) => {
    return {...product,id:index.toString()}
})

export const menus:Menu[] = [
    {name:'Best In Pizza',id:'1',productId:['1','2','3','4']},
    {name:'Recommended',id:'2',productId:['1','2','3','4']},
    {name:'Pizza',id:'3',productId:['1','2','3','4']},
    {name:'Deals',id:'4',productId:['1','2','3','4']},
    {name:'Gourmet Pizzas',id:'5',productId:['1','2','3','4']},
    {name:'Pasta',id:'6',productId:['1','2','3','4']},
    {name:'Wingstreet',id:'7',productId:['1','2','3','4']},
    {name:'Side Items',id:'8',productId:['1','2','3','4']}
]