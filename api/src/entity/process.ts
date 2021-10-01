
export interface Process {
    path : string
    preprocess:() => void
    main :() => void
    postprocess :() => void
    record :() => void
}