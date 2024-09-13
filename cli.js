#!/usr/bin/env node

import { execSync } from "child_process";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
import { b } from "./baml_client";

const query = process.argv[2] || "Show me all the top 5 meetings by duration";
const schema = `
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
const url = process.env.NEO4J_URL;

async function main() {
  try {
    const generatedQuery = await b.GenerateGraphQLQuery(query, schema, url);
    console.log("Generated GraphQL Query:");
    console.log(generatedQuery);

    // Extract the curl command
    const curlCommand = generatedQuery.match(/```([\s\S]*?)```/)[1].trim();

    // Execute the curl command and capture the output
    const curlOutput = execSync(curlCommand, { encoding: "utf-8" });

    // Parse the JSON response
    const jsonResponse = JSON.parse(curlOutput);

    console.log("\nServer Response:");
    console.log(JSON.stringify(jsonResponse, null, 2));

    // Interpret the result
    const interpretation = await b.InterpretResult(
      query,
      JSON.stringify(jsonResponse)
    );
    console.log("\nInterpreted Result:");
    console.log(interpretation);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
