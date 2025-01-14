export const createFileName = (data) => {
  if (data?.whichSpecies) {
    return `${data.whichSpecies}/${data.sbi}/${data.reference}.pdf`
  }

  return `${data.sbi}/${data.reference}.pdf`
}
