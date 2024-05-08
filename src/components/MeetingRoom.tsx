import {
    CallControls,
    CallingState,
    CallParticipantsList,
    CallStatsButton,
    PaginatedGridLayout,
    SpeakerLayout,
    useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useState } from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutList, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';
import Loader from './Loader';

type CallLayout = 'Grid' | 'Speaker-left' | 'Speaker-right';

const MeetingRoom = () => {
    const [layout, setlayout] = useState<CallLayout>('Speaker-left');
    const [showParticipants, setShowParticipants] = useState(false);
    const searchParams = useSearchParams();
    const isPersonalRoom = !!searchParams.get('personal');
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const router = useRouter();

    if (callingState !== CallingState.JOINED) return <Loader />;

    const CallLayout = () => {
        switch (layout) {
            case 'Grid':
                return <PaginatedGridLayout />;
            case 'Speaker-left':
                return <SpeakerLayout participantsBarPosition={'left'} />;
            case 'Speaker-right':
                return <SpeakerLayout participantsBarPosition={'right'} />;
            default:
                return <SpeakerLayout participantsBarPosition={'right'} />;
        }
    };

    return (
        <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
            <div className='relative flex size-full items-center justify-center'>
                <div className='size-full flex max-w-[1000px] items-center'>
                    <CallLayout />
                </div>
                <div
                    className={cn('h-[calc(100vh-86px)] hidden ml-2', {
                        block: showParticipants,
                    })}
                >
                    <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </div>
            </div>
            <div className='fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap'>
                <CallControls onLeave={() => router.push('/')} />

                <DropdownMenu>
                    <div className='flex items-center'>
                        <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
                            <LayoutList size={20} className='text-white' />
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent className='bg-dark-1 text-white border-dark-1'>
                        {['Grid', 'Speaker-left', 'Speaker-right'].map((item) => (
                            <div key={item}>
                                <DropdownMenuItem
                                    className='cursor-pointer'
                                    onClick={() => setlayout(item as CallLayout)}
                                >
                                    {item}
                                </DropdownMenuItem>
                            </div>
                        ))}
                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
                <CallStatsButton />
                <button onClick={() => setShowParticipants((prev) => !prev)}>
                    <div className='cursor-pointer rounded-2xl  bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
                        <Users size={20} className='text-white' />
                    </div>
                </button>
                {!isPersonalRoom && <EndCallButton />}
            </div>
        </section>
    );
};

export default MeetingRoom;
