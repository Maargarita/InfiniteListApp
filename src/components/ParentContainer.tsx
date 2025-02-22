import { FC, useEffect, useState } from "react"
import { List } from "./List"

export interface ListItem {
    id: number,
    name: string,
}

export const ParentContainer: FC = () => {
    const [listItems, setListItems] = useState<ListItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFetching, setisFetching] = useState(true)

    const generateList = async () => {
        let generatePromise = new Promise<ListItem[]>((resolve, reject) => {
            let items = []
            for (let i = 0; i < 1000; i++) {
                items.push({id: i + 1, name: `item ${i + 1}`})    
            }

            resolve(items)
        })
          
        generatePromise.then((data) => {
            setListItems(data)
            setIsLoading(false)
        })
    }

    const getListItems = async (offset: number, count: number) : Promise<[ListItem[], number]> => {
        setisFetching(true)
        let result: [ListItem[], number] = [[], 0]

        let getPromise = new Promise<[ListItem[], number]>((resolve, reject) => {
            setTimeout(() => {
                resolve([listItems.slice(offset, offset + count), listItems.length])
            }, 100)
        })
          
        await getPromise.then((data) => {
            setisFetching(false)
            result = data
        })

        return result
    }

    useEffect(() => {
        generateList()
    }, [])

    return (
        <>
            {isLoading
                ? <div>....Загрузка</div>
                :   <List 
                        getListItems={getListItems}
                        isFetching={isFetching}
                        count={50}
                    />
            }
        </>
    )
}
