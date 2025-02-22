import { FC, useCallback, useEffect, useRef, useState } from "react"
import { ListItem } from "./ParentContainer"

interface ListProps {
    getListItems: (offset: number, count: number) => Promise<[ListItem[], number]>,
    isFetching: boolean,
    count: number
}

export const List: FC<ListProps> = ({getListItems, isFetching, count}) => {
    const [listItems, setListItems] = useState<ListItem[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [offset, setOffset] = useState(0)
    const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false)

    const lastItemObsever = useRef<IntersectionObserver>(null)
    const lastItemRef = useCallback((node: HTMLDivElement) => {
        if (isFetching) 
            return

        if (lastItemObsever.current) 
            lastItemObsever.current.disconnect()
        
        lastItemObsever.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && listItems.length < totalCount) {
                getItems()
            }
        })
        
        if (node) 
            lastItemObsever.current.observe(node)
    }, [isFetching, totalCount])

    const firstItemObsever = useRef<IntersectionObserver>(null)
    const firstItemRef = useCallback((node: HTMLDivElement) => {
        firstItemObsever.current = new IntersectionObserver(entries => {
            setIsScrollToTopVisible(!entries[0].isIntersecting)
        })
        
        if (node) 
            firstItemObsever.current.observe(node)
    }, [])

    const getItems = async () => {
        const [items, total] = await getListItems(offset, count)
        setOffset(offset + count)
        setListItems([...listItems, ...items])
        setTotalCount(total)
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        })
    }

    useEffect(() => {
        getItems()
    }, [])

    return (
        <div>
            {listItems.map((item, index) => {
                if (index === 0) {
                    return <div ref={firstItemRef} key={item.id}>
                                <p>{item.name}</p>
                            </div>
                }
                if (listItems.length === index + 1) {
                    return <div ref={lastItemRef} key={item.id}>
                                <p>{item.name}</p>
                            </div>
                } else  {
                    return <div key={item.id}>
                                <p>{item.name}</p>
                            </div>
                }
            })}

            {isScrollToTopVisible &&
                <button 
                    onClick={scrollToTop}
                    style={{
                        position: 'fixed', 
                        bottom: 0, 
                        right: 0, 
                        margin: '1rem',
                        padding: '0.5rem',
                        borderRadius: '1rem',
                        border: 'none',
                        backgroundColor: 'black',
                        color: 'white'

                    }}
                >В начало</button>
            }
        </div>
    )
}
