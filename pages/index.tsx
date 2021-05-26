import { GetServerSideProps } from 'next';
import React from 'react';
import { useQuery } from 'react-query';
import { HomePage } from '../components/HomePage';
import { LandingPage } from '../components/LandingPage';
import { UserType } from '../models/user';
import { parseUser } from '../utils/parseDiscordUser';
import { getMovies } from '../utils/queries';
import BannedPage from '../components/BannedPage';
import { MovieType } from '../models/movie';

interface HomePageProps {
    user: UserType | null;
    movies: [];
}

export default function Home({ user, movies }: HomePageProps) {
    if (!user) {
        return <LandingPage />;
    }
    if (user.isBanned) {
        return <BannedPage user={user} />;
    }
    //idk typescript well enough to know whats goin wrong here but | any ignores it :/
    const data: MovieType[] | any = useQuery(`movies`, getMovies, {
        initialData: movies,
    });
    return <HomePage user={user} movies={data} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const user: UserType = await parseUser(ctx);

    if (!user) {
        return { props: { user: null } };
    }
    const movies = await getMovies();
    return { props: { user, movies } };
};
