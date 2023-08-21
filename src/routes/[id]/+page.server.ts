import type { PageServerLoad } from './$types';
import { z } from 'zod';

const Time = z.string().regex(/\d{2}:\d{2}:\d{2}.\d{3}Z/);

const Event = z.object({
	data: z.object({
		event: z.object({
			id: z.string(),
			title: z.string(),
			description: z.string(),
			type: z.number(),
			pollStartTime: Time,
			pollEndTime: Time,
			maxScheduledDurationMins: z.number().nullable(),
			timeZone: z.string(),
			pollDates: z.array(z.string().regex(/\d{4}-\d{2}-\d{2}/)),
			start: z.string().datetime().nullable(),
			end: z.string().datetime().nullable(),
			isScheduled: z.boolean(),
			createdAt: z.string().datetime(),
			updatedAt: z.string().datetime(),
			user: z
				.object({
					id: z.string()
				})
				.nullable(),
			// googleEvents: z.null(),
			googleEvents: z.any(),
			pollResponses: z.array(
				z.object({
					id: z.string(),
					user: z.union([
						z.object({
							__typename: z.literal('User'),
							id: z.string(),
							name: z.string(),
							email: z.string().email(),
							__isNode: z.string()
						}),
						z.object({
							__typename: z.literal('AnonymousUser'),
							name: z.string(),
							email: z.string()
						})
					]),
					availabilities: z.array(
						z.object({
							start: z.string().datetime(),
							end: z.string().datetime()
						})
					),
					event: z.object({
						id: z.string()
					})
				})
			)
		})
	})
});

const getEvent = async (id: string) => {
	const eventResponse = await fetch('https://api.lettucemeet.com/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: 'EventQuery',
			query:
				'query EventQuery(\n  $id: ID!\n) {\n  event(id: $id) {\n    ...Event_event\n    ...EditEvent_event\n    id\n  }\n}\n\nfragment EditEvent_event on Event {\n  id\n  title\n  description\n  type\n  pollStartTime\n  pollEndTime\n  maxScheduledDurationMins\n  pollDates\n  isScheduled\n  start\n  end\n  timeZone\n  updatedAt\n}\n\nfragment Event_event on Event {\n  id\n  title\n  description\n  type\n  pollStartTime\n  pollEndTime\n  maxScheduledDurationMins\n  timeZone\n  pollDates\n  start\n  end\n  isScheduled\n  createdAt\n  updatedAt\n  user {\n    id\n  }\n  googleEvents {\n    title\n    start\n    end\n  }\n  pollResponses {\n    id\n    user {\n      __typename\n      ... on AnonymousUser {\n        name\n        email\n      }\n      ... on User {\n        id\n        name\n        email\n      }\n      ... on Node {\n        __isNode: __typename\n        id\n      }\n    }\n    availabilities {\n      start\n      end\n    }\n    event {\n      id\n    }\n  }\n}\n',
			variables: { id }
		})
	});

	const event = await eventResponse.json();

	return Event.parse(event).data.event;
};

export const load: PageServerLoad = async ({ params }) => {
	return {
		event: getEvent(params.id)
	};
};
