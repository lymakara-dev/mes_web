import { GalleryVerticalEnd } from 'lucide-react'
import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full my-12 items-center justify-center h-screen">
            <div className="flex w-[80%] items-center justify-center flex-col gap-4 p-6 md:p-10">
                <div className="flex w-full justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Mock Exam System.
                    </a>
                </div>
                {children}
            </div>
        </div>
    )
}

export default layout