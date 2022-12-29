export interface Product {
    id: string,
    name: string,
    isVegan: boolean,
    price: number,
    currency: string,
    discount: number,
    description: string,
    servesFor: number,
    imageAddress: string,
    config: ProductConfig[]
}

export interface ProductConfig {
    name: string,
    required: boolean,
    maximumSelection: number,
    options: ProductConfigOption[]
}

export interface ProductConfigOption {
    name: string,
    price: number,
    isVegan: boolean
}

export interface Menu {
    name: string,
    productId: string[],
    id: string
}
