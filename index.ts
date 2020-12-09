import Base from './base.ts'

let project = JSON.parse(Deno.readTextFileSync('./project.eg'))

console.info(project)

let srcPath = project.projectPath + '/' + project.sourceDir
const outputPath = project.projectPath  + '/eg/build'
console.info('output path: ', outputPath)
Deno.mkdirSync(outputPath,  { recursive: true })



let allFiles = Base.fetchFiles(srcPath)
let scriptFiles = allFiles.filter((file:any) => {
    return file.name.endsWith('.ts')
    || file.name.endsWith('.js')
    || file.name.endsWith('.ux')
})

console.info('files ', scriptFiles)
const getDirPathFromFilePath = (filePath: string) => {
    let tArr = filePath.split(/\/|(\\\\)/)
        .filter(i => i)         // 有可能包含undefined
    tArr.pop()
    tArr.push('')    
    return tArr.join('/')
} 

const rePath = (path: string) => {
    let resPath = path.split('/').map(i => {
        if (i) {
            return '..'
        } else {
            return '.'
        }
    }).join('/')

    if (resPath.startsWith('/')) {
        resPath = '.' + resPath 
    }
    console.info('rePath', path, resPath)

    return resPath
}

const reConvertFileToAt = (file:any) => {
    console.info('Function readFile start, args: ', file)
    let content = Deno.readTextFileSync(file.path)
    // console.info(content)
    const regImport =  /import +.*? from +(.*);?/g
    let improts = content.match(regImport)
    improts?.forEach((imp:string) => {
        const regItem = /import +.*? from +(.*);?/
        let res = regItem.exec(imp) 
        if (res && res?.length > 1) {
            let regTarget = res[1].replace('\"','').replace('\'','') 
            if (regTarget.includes('*')) {

            } else if (regTarget.includes("https")) {
                // do nothing
            } else if  (regTarget.indexOf('@') !== -1) {
                let out = imp.replace('@', rePath(file.dir.replace(srcPath,''))) 
                console.info(out)
                content = content.replace(imp, out) 
            }
        } else {
            
            console.info('res < 1' ,res, res?.length)
        }
    })
    let targetPath = outputPath + file.path.replace(srcPath, '')
    console.info(targetPath)
    
    Deno.mkdirSync(getDirPathFromFilePath(targetPath),  { recursive: true })
    Deno.writeTextFileSync(targetPath, content)
}

scriptFiles.forEach((file: any) => {
    reConvertFileToAt(file)
})


let target = outputPath+ '/' + project.entry
console.info('try run', target)
const p = Deno.run({
    cmd: ["Deno", "run", project.args, target],
  });

console.info('run', p)

const heart = (proc: any) => {
    if (proc) {
        setTimeout(()=> {
            // console.info('heart ', new Date())
            heart(proc)
        },1000)
    }
}

heart(p)