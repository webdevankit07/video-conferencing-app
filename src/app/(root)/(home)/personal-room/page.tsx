'use client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React from 'react';

const Table = ({ title, description }: { title: string; description: string }) => (
    <div className='flex flex-col items-start gap-2'>
        <h1 className='text-base font-medium text-sky-1 lg:text-xl xl:min-w-32'>{title}</h1>
        <h2
            className={`truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl ${
                title === 'Invite Link' && 'text-blue-600 underline cursor-pointer'
            }`}
            onClick={() => {
                if (title !== 'Invite Link') return;
                navigator.clipboard.writeText(`http://${description}`);
                toast({ title: 'Link Copied' });
            }}
        >
            {description}
        </h2>
    </div>
);

const PersonalRoom = () => {
    const { user } = useUser();
    const MeetingId = user?.id;
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${MeetingId}?personal=true`;
    const client = useStreamVideoClient();
    const router = useRouter();

    const { call } = useGetCallById(MeetingId!);

    const startRoom = async () => {
        if (!user || !client) return;

        if (!call) {
            const newCall = client.call('default', MeetingId!);
            await newCall?.getOrCreate({
                data: {
                    starts_at: new Date().toISOString(),
                },
            });
        }

        router.push(`/meeting/${MeetingId}?personal=true`);
    };

    return (
        <section className='flex size-full flex-col gap-10 text-white'>
            <h1 className='text-3xl font-bold'>Personal Room</h1>
            <div className='flex w-full flex-col gap-8 xl:max-w-[900px]'>
                <Table title='Topic' description={`${user?.username}'s meeting room`} />
                <Table title='Meeting ID' description={`${MeetingId}`} />
                <Table title='Invite Link' description={`${meetingLink}`} />
            </div>
            <div className='flex gap-5'>
                <Button className='bg-blue-1' onClick={startRoom}>
                    Start Meeting
                </Button>
                <Button
                    className='bg-dark-3'
                    onClick={() => {
                        navigator.clipboard.writeText(`http://${meetingLink}`);
                        toast({ title: 'Link Copied' });
                    }}
                >
                    Copy Link
                </Button>
            </div>
        </section>
    );
};

export default PersonalRoom;
