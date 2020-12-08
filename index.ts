import Base from './base.ts'

let project = JSON.parse(Deno.readTextFileSync('./project.eg'))

console.info(project)

let srcPath = project.projectPath + '/' + project.sourceDir
const outputPath = project.projectPath + '/eg/build'
console.info('output path: ', outputPath)
Deno.mkdirSync(outputPath,  { recursive: true })



let allFiles = Base.fetchFiles(srcPath)
let scriptFiles = allFiles.filter((file:any) => {
    return file.name.endsWith('.ts')
    || file.name.endsWith('.js')
    || file.name.endsWith('.ux')
})

console.info('files ', scriptFiles)

const reConvertFileToAt = (file:any) => {
    console.info('Function readFile start, args: ', file)
    let content = Deno.readTextFileSync(file.path)
    // console.info(content)
    const regImport =  /import +.*? from +(.*);?/g
    let improts = content.match(regImport)
    improts?.forEach((imp:string) => {
        const regItem = /import +.*? from +(.*);?/
        let res = regItem.exec(imp)
        console.info('FileLoader load mport:[' + imp+ ']', res)
        if (res && res?.length > 1) {
            let regTarget = res[1].replace('\"','').replace('\'','') 
            if (regTarget.indexOf('@') !== -1) {
                console.info(regTarget, file)
            }
        } else {
            
            console.info('res < 1' ,res, res?.length)
        }
    })
    Deno.writeTextFileSync(file.path, content)
}

scriptFiles.forEach((file: any) => {
    reConvertFileToAt(file)
})
