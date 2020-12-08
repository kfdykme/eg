
/**
 * 找到所有文件
 * @param path 
 */
const fetchFiles = (path:string) => {
    console.info('Function fetchFiles start, args: ', path)
    let results:any[] = []
    for (const dirEntry of Deno.readDirSync(path)) {
        if (dirEntry.isFile) {
            results.push({
                name: dirEntry.name,
                dir: path,
                path: path + '/' + dirEntry.name
            })
        }

        if (dirEntry.isDirectory) { 
            results = results.concat(fetchFiles(path+ '/' + dirEntry.name))
        }
    }
    return results
}

/**
 * 去除path中的../和./
 * @param filePath 
 */
const shortPath = (filePath: string) => {
    let res:string[] = []
    let tArr = filePath.split(/\/|(\\\\)/)
        .filter(i => i).forEach((i:string) => {
            if (i === '..') {
                try {
                    res.pop()
                } catch (e) {
                    console.info('empty list can not pop')
                }
            } else if (i === '.') {

            } else {
                res.push(i)
            }
        })         // 有可能包含undefined 
        
    return res.join('/')
}



export default {
    fetchFiles,
    shortPath
}
    