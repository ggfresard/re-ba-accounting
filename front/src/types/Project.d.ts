import { Interface } from "readline";

interface Project {
    name: string,
    participation: { partner: Partner, percentafe: number }[]
    expenses: { partner: Partner, amount: number }
}