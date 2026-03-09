use anyhow::{Context, Result};
use std::env;
use std::fs;
use std::path::Path;

fn main() -> Result<()> {
    let out_dir = env::var("OUT_DIR").context("OUT_DIR not set")?;
    let out_dir_path = Path::new(&out_dir);

    // 1. Prepare JS source
    let js_path = Path::new("js/mermaid.js");
    let bc_path = out_dir_path.join("mermaid.bc");

    println!("cargo:rerun-if-changed=js/mermaid.js");

    // 2. Compile to Bytecode using rquickjs
    eprintln!("Compiling to QuickJS bytecode natively...");
    compile_to_bytecode(&js_path, &bc_path)?;
    Ok(())
}

fn compile_to_bytecode(in_path: &Path, out_path: &Path) -> Result<()> {
    let source = fs::read_to_string(in_path).context("Failed to read mermaid.js")?;

    let rt = rquickjs::Runtime::new().context("Failed to create QuickJS runtime")?;
    let ctx = rquickjs::Context::full(&rt).context("Failed to create QuickJS context")?;

    ctx.with(|ctx| -> Result<()> {
        let module = rquickjs::Module::declare(ctx.clone(), "mermaid.js", source)
            .context("Failed to declare QuickJS module")?;
        let options = rquickjs::module::WriteOptions {
            strip_debug: false,
            strip_source: false,
            ..Default::default()
        };

        let bytecode = module
            .write(options)
            .context("Failed to compile module to bytecode")?;

        fs::write(out_path, bytecode).context("Failed to write mermaid.bc")?;
        Ok(())
    })?;

    Ok(())
}
