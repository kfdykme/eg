import Base from './base.ts'

console.info(Deno.cwd()) 
let content = new TextDecoder('utf-8').decode(Deno.readFileSync('./project.eg'))
console.info(content)
let project = JSON.parse(content)
console.info(project)

let srcPath = project.projectPath + '/' + project.sourceDir

console.info('src path: ', srcPath)

let allFiles = Base.fetchFiles(srcPath)
let scriptFiles = allFiles.filter((file:any) => {
    return file.name.endsWith('.ts')
    || file.name.endsWith('.js')
    || file.name.endsWith('.ux')
})

console.info('files ', scriptFiles)




const convertFileToAt = (file:any) => {
    console.info('Function readFile start, args: ', file)
    let content = Deno.readTextFileSync(file.path)
    // console.info(content)
    const regImport =  /import +.*? from +(.*);?/g
    let improts = content.match(regImport)
    improts?.forEach((imp:string) => {
        const regItem = /import +.*? from +(.*);?/
        let res = regItem.exec(imp)
        console.info('FileLoader load mport:[' + imp+ ']', res)
        if (res &&res?.length > 1) {
            let regTarget = res[1].replace('\"','').replace('\'','')
            if (regTarget.includes('*')) {

            } else if (regTarget.includes("https")) {
                // do nothing
            } else if (regTarget.indexOf('@') === -1) {
                let out = imp.replace(regTarget, file.dir + '/' + regTarget).replace(srcPath, '@')
                out = Base.shortPath(out)
                content = content.replace(imp, out)
            }
        } else {
            
            console.info('res < 1' ,res, res?.length)
        }
    })
    Deno.writeTextFileSync(file.path, content)
}

scriptFiles.forEach((file: any) => {
    convertFileToAt(file)
})

