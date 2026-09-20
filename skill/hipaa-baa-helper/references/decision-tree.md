# HIPAA BAA decision tree

Steps are listed in the order they are asked. "Yes" and "No" show where each answer goes. Result nodes are at the bottom.

## Questions

### 1. PHI threshold
Will the other organization or person create, receive, maintain, or transmit any individually identifiable health information that came from (or is handled on behalf of) a doctor's office, hospital, health plan, or other health care provider?
Help: Includes patient names linked to diagnoses, treatment notes, billing records, appointment details, insurance claims. Excludes fully de-identified data.
- Yes -> 2
- No or unsure -> RESULT no-phi

### 2. Plan sponsor check
Is the outside party the employer or plan sponsor of a group health plan, receiving this information to help run the plan itself (not just routine enrollment or disenrollment numbers)?
- Yes -> 3a
- No -> 3b

### 3a. Plan sponsor certification
Have the group health plan's plan documents been amended to include HIPAA's required certifications (use restricted to plan administration, no employment decisions based on it, firewall from the employer's other functions)?
- Yes -> RESULT plan-sponsor-ok
- No or unsure -> RESULT plan-sponsor-needed

### 3b. Subcontractor check
Is the outside party a business associate that is hiring this vendor as its own subcontractor, rather than the covered entity hiring them directly?
Help: A subcontractor is a vendor's vendor. HIPAA treats subcontractors like business associates, but it changes who signs with whom.
- Yes -> 4 (remember: subcontractor = true)
- No -> 4

### 4. Workforce
Is the other party an employee, volunteer, trainee, or student under the direct control of the same organization, rather than a separate outside company or individual?
Help: Workforce is broad, covering anyone under direct supervision, paid or not. Independent contractors and outside companies are not workforce, even long-term ones.
- Yes -> RESULT workforce
- No -> 5

### 5. Function on behalf of the organization
Will the outside party use or see this information to perform a function, activity, or service for the organization, such as billing, claims processing, IT hosting, data storage, data analysis, consulting, legal or accounting work, transcription, answering service, or software that stores or processes patient data?
- Yes -> 6a
- No -> 6b

### 6a. Treatment (function path)
Is the only reason the outside party has this information that they are helping treat the same patient (referral, shared care coordination), rather than performing an administrative, technical, or business service?
- Yes -> RESULT treatment
- No -> 7a

### 6b. Treatment (no function path)
Is the information shared only so another health care provider can treat the same patient (referral, transfer of care, records for ongoing treatment)?
- Yes -> RESULT treatment
- No -> 7b

### 7a. Public interest and research (function path)
Is the only reason the outside party has the information that they are a public health authority, health oversight agency, law enforcement, a court, or a researcher under a recognized research exception (authorization, IRB or privacy board waiver, limited data set agreement), rather than performing a service for the organization?
- Yes -> RESULT public-interest
- No -> 8

### 7b. Public interest and research (no function path)
Same question without the "rather than performing a service" clause.
- Yes -> RESULT public-interest
- No -> RESULT unclear

### 8. Safe Harbor de-identification checklist
Data is de-identified only if every identifier below has been removed for the individual and their relatives, employers, and household members, AND the organization has no actual knowledge the remaining data could identify the person:
1. Names
2. Geographic subdivisions smaller than a state (street address, city, county, precinct, ZIP code)
3. All elements of dates other than year tied to an individual (birth, admission, discharge, death) and ages over 89
4. Telephone numbers
5. Fax numbers
6. Email addresses
7. Social Security numbers
8. Medical record numbers
9. Health plan beneficiary numbers
10. Account numbers
11. Certificate or license numbers
12. Vehicle identifiers and serial numbers, including license plates
13. Device identifiers and serial numbers
14. Web URLs
15. IP addresses
16. Biometric identifiers, including fingerprints and voiceprints
17. Full-face photographs and comparable images
18. Any other unique identifying number, characteristic, or code

- All removed and no actual knowledge -> RESULT deidentified
- Anything remaining -> 9

### 9. Conduit
Does the outside party's role consist only of transporting or briefly routing the data, without routine or ongoing ability to access, view, or use its contents (mail courier, shipping company, an ISP that just carries traffic)?
Help: Very narrow. Cloud storage, hosting, backup, or file-sharing vendors almost always have enough access to fail this test, even if data is encrypted. When in doubt, assume it does not apply.
- Yes -> RESULT conduit
- No -> 10

### 10. Financial institution
Is the outside party a bank or payment processor whose only role is processing a payment the patient or plan member directly initiated (credit card or check for a bill), rather than any other health care related function?
Help: Does not cover a billing company, revenue cycle vendor, or payment platform that also touches claims or patient account data.
- Yes -> RESULT financial
- No -> RESULT baa-required

## Results

### no-phi (no BAA)
No BAA needed: no protected health information involved. BAA requirements are triggered only by use or disclosure of PHI.
Citations: 45 CFR § 160.103 (definitions of "protected health information" and "business associate"); 45 CFR § 164.502(a) (general limits on uses and disclosures of PHI).
Next steps: double-check no identifiable data changes hands, even indirectly (a name plus an appointment time is PHI). If close, treat as PHI or ask counsel.

### plan-sponsor-ok (no BAA)
No BAA needed: certified plan sponsor arrangement. A group health plan may share PHI with its plan sponsor for plan administration once plan documents are amended and certified. This substitutes for a BAA.
Citations: 45 CFR § 164.504(f).
Next steps: confirm the data shared matches what the amended plan documents describe. Revisit periodically as use cases change.

### plan-sponsor-needed (action needed, not a BAA)
The plan documents must be amended and the plan sponsor must certify compliance before plan-administration data can be shared. A standard BAA is the wrong tool here.
Citations: 45 CFR § 164.504(f).
Next steps: work with counsel to amend plan documents and obtain the certification. Meanwhile limit sharing to enrollment and disenrollment information.

### workforce (no BAA)
No BAA needed: internal workforce member. Workforce members are covered by the organization's own HIPAA policies, training, and sanctions, so no separate contract is needed even if they handle PHI daily.
Citations: 45 CFR § 160.103 (definition of "workforce"); 45 CFR § 164.530(b), (c) (training and safeguards owed to workforce).
Next steps: confirm the person is truly under direct control, not an independent contractor or staffing agency worker. Make sure HIPAA workforce training is done.

### treatment (no BAA)
No BAA needed: treatment disclosure. Provider-to-provider disclosures for treatment of the same patient fall under the treatment exception. A treating provider is not performing a service on behalf of the referring provider.
Citations: 45 CFR § 160.103 (definition of "business associate" excludes a health care provider receiving disclosures from a covered entity concerning the treatment of the individual); 45 CFR § 164.506(c) (permitted uses and disclosures for treatment). Do not cite § 164.502(e)(1)(ii) here: since the 2013 Omnibus Rule it covers business associate to subcontractor disclosures.
Next steps: if the same party also provides billing, analytics, or storage, evaluate that separately, it likely needs a BAA. Keep the disclosure limited to what treatment requires.

### public-interest (no BAA)
No BAA needed: permitted public-interest or research disclosure. Public health authorities, oversight agencies, courts, and researchers under a recognized exception exercise independent authority and are not acting on the organization's behalf. A limited data set still requires a data use agreement, which is not a BAA.
Citations: 45 CFR § 164.512 (public health, judicial, law enforcement, research disclosures); 45 CFR § 164.514(e) (limited data sets and data use agreements).
Next steps: if the same party also performs a paid service involving other PHI, evaluate that role separately. Put a data use agreement in place for any limited data set.

### deidentified (no BAA)
No BAA needed: data meets Safe Harbor de-identification. Properly de-identified data is not PHI, so business associate rules do not apply while it stays de-identified. Expert determination is the alternative method.
Citations: 45 CFR § 164.514(a); 45 CFR § 164.514(b)(2).
Next steps: confirm the recipient cannot re-identify (no reversible key or code). Re-check if fields are added later or identifiable data flows back.

### conduit (no BAA)
No BAA needed: narrow conduit exception. Couriers, postal services, and ISPs that only transport data with at most transient access are not business associates. HHS stresses this is narrow, and encryption does not rescue a storage or hosting vendor.
Citations: 45 CFR § 160.103 (definition of "business associate"); 78 Fed. Reg. 5566, 5571 (Jan. 25, 2013), Omnibus Rule preamble.
Next steps: re-check carefully, since most vendors that store, host, or back up data are not conduits. Any standing ability to view the data means treat them as a business associate.

### financial (no BAA)
No BAA needed: ordinary payment processing. A financial institution merely processing a consumer-initiated payment is not a business associate for that function. A billing company or payment platform that also touches claims or patient account data is a business associate for that broader role.
Citations: 45 CFR § 160.103; 65 Fed. Reg. 82476, 82601 (Dec. 28, 2000), Privacy Rule preamble.
Next steps: confirm the role is limited to clearing the payment. If they also do eligibility checks, claims submission, or revenue cycle work, evaluate that part separately.

### baa-required (BAA required)
A BAA is required. The outside party creates, receives, maintains, or transmits PHI to perform a service on behalf of the organization and no exception applies. A written BAA must be in place before PHI is shared. Subcontractors the party uses to touch the PHI are themselves business associates and need their own BAA with the party that hired them.
Citations: 45 CFR § 160.103 (definitions of "business associate" and "subcontractor"); 45 CFR § 164.502(e)(1)(i) (no disclosure to a business associate without satisfactory assurances); 45 CFR § 164.502(e)(1)(ii) (same rule for a business associate disclosing to its subcontractor); 45 CFR § 164.504(e) (required BAA contents).
Next steps: get a written BAA in place before any PHI is shared. Make sure it covers permitted uses, safeguards, breach notification, subcontractor flow-down, and return or destruction of data at the end. Confirm the party has BAAs with its own subcontractors.
Subcontractor note (only if the subcontractor check was yes): because the other organization is itself a business associate, any BAA here is between the user's organization and that business associate, not the covered entity. Subcontractors of a business associate are treated as business associates under 45 CFR § 160.103, so the requirement carries down the chain.

### unclear (closer look)
This does not clearly fit the business associate definition or a standard exception. It may fall under a separate HIPAA provision this tool does not cover, or may not be a HIPAA-regulated disclosure at all.
Citations: 45 CFR § 160.103; 45 CFR § 164.512.
Next steps: identify the specific reason the data is shared, since it may fit another permitted-disclosure category. Check with privacy counsel before proceeding.
