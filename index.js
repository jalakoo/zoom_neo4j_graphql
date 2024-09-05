import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { Neo4jGraphQL } from '@neo4j/graphql';
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

// Load environment variables (for local development)
dotenv.config();

// Load environment variables from Cloud Run or dotenv
const NEO4J_URL = process.env.NEO4J_URL;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;
const PORT = process.env.PORT || 8080; // Google Cloud Run dynamically assigns the port

const typeDefs = `#graphql
type Meeting {
	duration: BigInt!
	hasRecordings: [Recording!]! @relationship(type: "HAS", direction: OUT)
	id: BigInt!
	meeting_end_time: String
	meeting_host_email: String
	meeting_host_id: String
	meeting_id: BigInt
	meeting_start_time: String
	meeting_topic: String
	meeting_uuid: String
	participantsAttended: [Participant!]! @relationship(type: "ATTENDED", direction: IN)
	participants_count: BigInt!
	start_time: DateTime!
	summary_created_time: String
	summary_end_time: String
	summary_last_modified_time: String
	summary_overview: String
	summary_start_time: String
	summary_title: String
	topic: String!
	total_minutes: BigInt!
	type: BigInt!
	usersHosted: [User!]! @relationship(type: "HOSTED", direction: IN)
	uuid: String!
}

type Participant {
	attendedMeetings: [Meeting!]! @relationship(type: "ATTENDED", direction: OUT)
	audio_call: [String]!
	audio_quality: String!
	camera: String
	connection_type: String
	customer_key: String!
	data_center: String!
	device: String!
	device_name: String!
	domain: String!
	email: String
	from_sip_uri: String!
	full_data_center: String!
	groupId: String!
	harddisk_id: String!
	health: String!
	id: String!
	internal_ip_addresses: [String]
	ip_address: String!
	join_time: DateTime!
	leave_reason: String!
	leave_time: DateTime!
	location: String!
	mac_addr: String!
	microphone: String
	network_type: String!
	os: String!
	os_version: String!
	participant_user_id: String
	participant_uuid: String!
	pc_name: String!
	recording: Boolean!
	registrant_id: String!
	role: String!
	screen_share_quality: String!
	share_application: Boolean!
	share_desktop: Boolean!
	share_whiteboard: Boolean!
	sip_uri: String!
	speaker: String
	status: String!
	user_id: String!
	user_name: String!
	usersIs: [User!]! @relationship(type: "IS", direction: IN)
	version: String!
	video_quality: String!
}

type Recording {
	download_url: String!
	file_extension: String!
	file_size: BigInt!
	file_type: String!
	id: String!
	meeting_id: String!
	meetingsHas: [Meeting!]! @relationship(type: "HAS", direction: IN)
	play_url: String
	recording_end: DateTime!
	recording_start: DateTime!
	recording_type: String!
	status: String!
}

type User {
	account_id: String!
	account_number: BigInt!
	cluster: String!
	cms_user_id: String!
	created_at: DateTime!
	dept: String!
	display_name: String!
	email: String!
	first_name: String!
	group_ids: [String]!
	hostedMeetings: [Meeting!]! @relationship(type: "HOSTED", direction: OUT)
	id: String!
	im_group_ids: [String]!
	isParticipants: [Participant!]! @relationship(type: "IS", direction: OUT)
	jid: String!
	job_title: String!
	language: String!
	last_client_version: String!
	last_login_time: DateTime!
	last_name: String!
	location: String!
	login_types: [BigInt]!
	personal_meeting_url: String!
	phone_number: String!
	pic_url: String!
	pmi: BigInt!
	role_id: String!
	role_name: String!
	status: String!
	timezone: String!
	type: BigInt!
	use_pmi: Boolean!
	user_created_at: DateTime!
	vanity_url: String!
	verified: BigInt!
}
`;

const driver = neo4j.driver(
  NEO4J_URL,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
);

const main = async () => {
  const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

  const app = express();

  // Create Apollo Server instance
  const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
  });

  // Start the server with Express middleware
  await server.start();
  app.use(express.json());
  app.use('/graphql', expressMiddleware(server));

  // Start the Express server on the provided port
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

// Start the Apollo server
main().catch(err => {
  console.error('Failed to start server', err);
});
