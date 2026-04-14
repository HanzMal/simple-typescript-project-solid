type NIP = string | number
type Coordinates = [number, number]

export interface Employee {
    nip: NIP,
    name: string,
    location: Coordinates
}