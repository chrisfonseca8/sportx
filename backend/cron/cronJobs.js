import cron from 'node-cron';
import { match_duration } from '../Utils/index.js';
import db from '../models/index.js';
import { match_statusEnums } from '../Utils/index.js';
const { LIVE, FINISHED, SCHEDULED } = match_statusEnums;


const { Match } = db;

export const match_cron = () => {

    cron.schedule('*/1 * * * *', async () => {

        try {

            const matches = await Match.findAll();

            const currentTime = Date.now();

            for (const match of matches) {

                const startTime = new Date(match.StartTime).getTime();

                const durationInMinutes = match_duration[match.Sport];

                // convert minutes -> milliseconds
                const endTime =
                    startTime + (durationInMinutes * 60 * 1000);

                if (currentTime > endTime) {

                    await Match.destroy({
                        where: {
                            id: match.id
                        }
                    });

                    console.log(`Deleted match ${match.id}`);

                }

                else if (
                    currentTime >= startTime &&
                    currentTime <= endTime
                ) {

                    await Match.update(
                        {
                            Status: LIVE
                        },
                        {
                            where: {
                                id: match.id
                            }
                        }
                    );

                    console.log(`Live match ${match.id}`);

                }


                console.log("Current:", new Date(currentTime));

                console.log(
                    "Start:",
                    new Date(startTime)
                );

                console.log(
                    "End:",
                    new Date(endTime)
                );
            }

        } catch (error) {

            console.log(error);

        }


    });
}