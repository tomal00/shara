export async function selectFileFromExplorer(): Promise<File> {
    return new Promise((resolve, reject) => {
        try {
            const el = document.createElement('input')
            el.type = 'file'
            el.style.display = 'none'
            document.body.appendChild(el)
            el.addEventListener('change', () => {
                try {
                    const file = el.files && el.files[0]
                    if (!file) throw 'FILE_NOT_SPECIFIED'

                    resolve(file)
                }
                catch (err) {
                    reject(err)
                }
            })
            el.click()
        }
        catch (err) {
            return reject(err)
        }
    })
}

export async function getFileArray(file: File): Promise<number[]> {
    return new Promise((res, rej) => {
        const r = new FileReader()
        r.onload = function (e) {
            const uInt8Arr = new Uint8Array(e.target.result as Iterable<number>)
            res([...uInt8Arr])
        };
        r.readAsArrayBuffer(file)
    })
} 