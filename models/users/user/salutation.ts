enum Salutation {
    MS = "Ms.",
    MR = "Mr.",
    MX = "Mx."
}

const SalutationDetails: Record<Salutation, { select: number }> = {
    [Salutation.MS]: {select: 0},
    [Salutation.MR]: {select: 1},
    [Salutation.MX]: {select: 2}
}

export {Salutation, SalutationDetails}