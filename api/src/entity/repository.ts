

export interface Repository<T> {
    get : (id : string) => T | null
    add : (id : string, instance : T) => void
}

