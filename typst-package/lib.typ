#let mermaid-wasm = plugin("mermaid.wasm")

// Renders image based on the source mermaid string.
#let render(
  src,
  ..args,
) = {
  let svg-output = str(mermaid-wasm.render(bytes(src)))

  image(
    bytes(svg-output),
    ..args,
  )
}

// Produces svg from the mermaid source.
#let render-svg(
  src,
) = {
  let svg-output = str(mermaid-wasm.render(bytes(src)))
  svg-output
}
