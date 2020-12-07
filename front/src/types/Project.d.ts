
interface Project {
    id?: number,
    client: string
    name: string,
    total_amount: number
    participants: { partner: number, participation: number }[]
    flows?: Flow[]
}