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