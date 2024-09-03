import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

const typeDefs = `#graphql
    type Meeting {
    duration: BigInt!
    id: BigInt!
    meeting_end_time: String
    meeting_host_email: String
    meeting_host_id: String
    meeting_id: BigInt
    meeting_start_time: String
    meeting_topic: String
    meeting_uuid: String
    participantsAttended: [Participant!]!
        @relationship(type: "ATTENDED", direction: IN)
    participants_count: BigInt!
    profilesHad: [Profile!]! @relationship(type: "HAD", direction: IN)
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
    uuid: String!
    }

    type Participant {
    attendedMeetings: [Meeting!]! @relationship(type: "ATTENDED", direction: OUT)
    audio_call: [String]!
    audio_quality: String!
    camera: String
    connection_type: String!
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
    version: String!
    video_quality: String!
    }

    type Profile {
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
    hadMeetings: [Meeting!]! @relationship(type: "HAD", direction: OUT)
    id: String!
    im_group_ids: [String]!
    jid: String!
    job_title: String!
    language: String!
    last_client_version: String!
    last_login_time: DateTime!
    last_name: String!
    location: String!
    login_types: [BigInt]!
    phone_number: String!
    pmi: BigInt!
    role_id: String!
    role_name: String!
    status: String!
    timezone: String!
    type: BigInt!
    use_pmi: Boolean!
    user_created_at: DateTime!
    verified: BigInt!
    }
`;

const driver = neo4j.driver(
    "neo4j://localhost:7687",
    neo4j.auth.basic("neo4j", "abcd1234")
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);