



function GenerateGraphQLQuery(query: string, schema: string, url: string) -> string {
  client Sonnet
  prompt #"
    Generate a graphql query for the following request.
    ---
    Request: {{query}}
    ---

    Here is the schema of the graphql database:
    {{schema}}


     Format guidelines:
    - Answer with a curl request the user can make to get the data they want. The endpoint is {{url}}.
    - Do not include any other text in your response.
    - Enclose the curl request in triple backticks.
    - Don't add extra \\\\ for strings.
    - For DateTime fields, always use ISO 8601 format strings (e.g., "2023-04-15T12:00:00Z") and ensure they are properly quoted within the GraphQL query.
    - When using date variables, format them as ISO 8601 strings.
    - Escape double quotes within the JSON payload.
    - The curl request follows apollo graphql client request format.
    - Write efficient queries.

    ---

    Example output bash commands:
     ---
    curl -X POST -H "Content-Type: application/json" -d '{
      "query": "{ meetings(where: { id: 1 }) { id topic duration participantsAttended { user_name } } }"
    }' {{url}}
    ---

    Remember to always use proper ISO 8601 format for DateTime fields and escape quotes correctly in the JSON payload.

   
  "#
}

test TestName {
  functions [GenerateGraphQLQuery]
  args {
    query #"
      Show me all the meetings that happened in the last 24 hours.
    "#
    url #"
      http://localhost:4000
    "#
    schema #"
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
    "#
  }
}
