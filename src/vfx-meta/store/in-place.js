export let inPlace = (animation) => {
  let item = animation?.tracks?.find((e) => e.name === 'Hips.position')?.values
  if (!item) {
    item = animation?.tracks?.find(
      (e) => e.name === 'mixamorigHips.position'
    )?.values
  }
  if (item) {
    item.map((v, i) => {
      if (i % 3 === 0) {
        item[i] = 0
      } else if (i % 3 === 1) {
        item[i] = 0
      } else {
        item[i] = v
      }
    })
  }

  return animation
}
