'use client';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { sideBarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const MobileNav = () => {
    const pathname = usePathname();

    return (
        <section className='w-full max-w-[264px]'>
            <Sheet>
                <SheetTrigger>
                    <Image
                        src={'/icons/hamburger.svg'}
                        width={36}
                        height={36}
                        alt='hamburger icon'
                        className='cursor-pointer sm:hidden'
                    />
                </SheetTrigger>
                <SheetContent side={'left'} className='bg-dark-1 border-none text-white'>
                    <Link href={'/'} className='flex items-center gap-1'>
                        <Image
                            src={'/icons/logo.svg'}
                            width={20}
                            height={20}
                            alt='main-logo'
                            className='max-sm:size-10'
                        />
                        <p className='text-[26px] font-extrabold text-white'>Zoom</p>
                    </Link>
                    <div className='flex flex-col pt-10 justify-between overflow-y-auto h-[calc(100vh-72px)]'>
                        <SheetClose asChild>
                            <section className='flex flex-col h-full gap-6 text-white'>
                                {sideBarLinks.map((link) => {
                                    const isActive = pathname === link.route;

                                    return (
                                        <SheetClose asChild key={link.route}>
                                            <Link
                                                href={link.route}
                                                key={link.label}
                                                className={cn(
                                                    'flex gap-4 items-center w-full max-w-60 p-4 rounded-lg',
                                                    {
                                                        'bg-blue-1': isActive,
                                                    }
                                                )}
                                            >
                                                <Image src={link.imgUrl} alt={link.label} width={24} height={24} />
                                                <p className='font-semibold'>{link.label}</p>
                                            </Link>
                                        </SheetClose>
                                    );
                                })}
                            </section>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    );
};

export default MobileNav;
