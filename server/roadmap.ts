/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoadmapDay, DifficultyLevel, TaskStatus } from '../src/types';

interface ModuleSyllabus {
  moduleName: string;
  subModules: {
    title: string;
    topics: string[];
    subtopicsList: string[][];
    practicalLabs: string[];
    miniAssignments: string[];
    revisionTopics: string[];
    interviewQuestionsList: string[][];
    githubCommits: string[];
    difficulty: DifficultyLevel;
  }[];
}

// Highly specific, technical DevOps syllabus blocks
const SYLLABUS: ModuleSyllabus[] = [
  {
    moduleName: 'Month 1: Linux, Shell Scripting, Networking & Git',
    subModules: [
      {
        title: 'Linux Fundamentals & Core Administration',
        topics: [
          'Linux Architecture and Directory Layout (FHS)',
          'User & Group Management, File Permissions, and ACLs',
          'Process Management & Resource Monitoring (top, htop, ps)',
          'Storage Administration: Disks, Partitions, LVM, and Mounts',
          'Package Management & Repository Management (APT, YUM/DNF)',
          'Linux Service Management (systemd, journalctl, systemctl)',
          'File Manipulation & Text Filtering (grep, sed, awk)',
          'Linux Boot Process, Runlevels, and Kernel Basics',
          'Task Scheduling: Cron Jobs & systemd timers',
          'Troubleshooting and Analyzing System Logs (/var/log/)'
        ],
        subtopicsList: [
          ['FHS standard', 'Kernel vs User Space', 'Shell environment', 'System architecture'],
          ['chmod', 'chown', 'umask', 'User/Group creation', 'ACL rules (getfacl, setfacl)'],
          ['process states', 'kill signals (9, 15)', 'nice/renice', 'df & du utilities', 'free & top'],
          ['fdisk', 'mkfs', 'Physical Volumes (PV)', 'Volume Groups (VG)', 'Logical Volumes (LV)', '/etc/fstab'],
          ['deb/rpm formats', 'apt/yum repositories', 'installing/removing software', 'building from source'],
          ['systemd service units', 'journalctl filtering', 'daemon-reload', 'enabling/starting services'],
          ['regular expressions', 'sed search-and-replace', 'awk column scanning', 'piping and redirection'],
          ['GRUB bootloader', 'initramfs', 'kernel parameters', 'dmesg logs', 'systemd-analyze'],
          ['crontab syntax', '/etc/cron.d/', 'at command', 'systemd timer units'],
          ['syslog config', 'secure logs analysis', 'auth.log inspection', 'logrotate utility']
        ],
        practicalLabs: [
          'Navigate FHS and document permissions of critical system files like /etc/passwd and /etc/shadow.',
          'Create a locked DevOps group, add users, and set up a shared directory with custom SGID and ACLs.',
          'Start background resource-intensive processes, manipulate their nice values, and safely terminate them.',
          'Add a virtual disk, initialize LVM, create a 10GB logical volume, format as ext4, and mount it persistently.',
          'Configure a custom third-party APT/YUM repository, install a package, and inspect its installed files.',
          'Write a custom systemd service unit to run a script, set up automatic restart policies, and run it.',
          'Extract specific IP addresses from Nginx logs using grep, sed, and awk, sorting by count of requests.',
          'Inspect dmesg logs, identify system startup warnings, and check systemd boot performance metrics.',
          'Write a cron job that backs up the /etc directory every hour and rotates old backups.',
          'Analyze server security log files to locate failed SSH login attempts and identify malicious IPs.'
        ],
        miniAssignments: [
          'Write a 1-page cheatsheet on file permissions and special flags (SUID, SGID, Sticky Bit).',
          'Create a script that auto-provisions 5 user accounts based on a CSV file input.',
          'Write a process watchdog script that checks if Nginx is running and restarts it if down.',
          'Create an LVM expander script that automates extending a volume group and resizing the filesystem.',
          'Write a guide explaining the differences between compile-time dependencies and run-time packages.',
          'Build a custom systemd-managed service for a Python/Node background daemon.',
          'Write a single-line command chain that prints the top 10 most visited paths from an access.log.',
          'Produce a boot analysis report detailing the slowest starting services on your system.',
          'Configure a systemd timer that triggers a script precisely at 3:00 AM on weekdays.',
          'Write a log parser that extracts and emails daily critical system error alerts.'
        ],
        revisionTopics: [
          'Basic terminal command execution',
          'Linux permissions vs user roles',
          'Process lifecycle and system load',
          'LVM hierarchy (PV, VG, LV)',
          'System packages and source dependencies',
          'systemd service configuration structure',
          'Regular expression syntax and flags',
          'Operating system bootstrap milestones',
          'Automation via task scheduling',
          'Log structures and level hierarchy'
        ],
        interviewQuestionsList: [
          ['Explain the difference between soft links and hard links.', 'What is the role of an inode in the filesystem?'],
          ['What is umask? How do you calculate default permissions for directories?', 'How does setfacl differ from chmod?'],
          ['How do you diagnose high CPU/Memory usage? What does Load Average signify?', 'What is the difference between kill -9 and kill -15?'],
          ['Describe LVM. How do you safely extend a logical volume on a live server?', 'What happens if a device is missing from /etc/fstab on boot?'],
          ['How do you fix broken package dependencies in Debian-based systems?', 'What is the purpose of a package repository GPG key?'],
          ['What are the target states in systemd? How does it differ from SysVinit?', 'How do you view log lines in real-time for a specific service?'],
          ['How would you find and replace a specific string across 100 text files recursively?', 'Explain the differences between grep, egrep, and fgrep.'],
          ['Explain the steps of the Linux boot process in chronological order.', 'What is the purpose of the initramfs?'],
          ['How does cron handle output of executed tasks? What does redirection of 2>&1 do?', 'What is the advantage of systemd timers over cron?'],
          ['Where are authentication failures logged? How can you track kernel panics?', 'Describe how logrotate works and why it is essential.']
        ],
        githubCommits: [
          'feat: add permission audit cheatsheet',
          'feat: add automated user provisioning script',
          'feat: add service watchdog bash script',
          'docs: add lvm administration guide and scripts',
          'docs: add package compilation step-by-step notes',
          'feat: add custom systemd service unit template',
          'feat: add nginx access log parser command chain',
          'docs: add linux system boot diagnostics report',
          'feat: add crontab configurations and automated backups script',
          'feat: add security log scraper script'
        ],
        difficulty: 'Medium'
      },
      {
        title: 'Shell Scripting & Automation',
        topics: [
          'Shell Scripting Basics: Shebang, Variables, and User Input',
          'Conditional Logic (if/else, case statements) and Comparison Operators',
          'Loops in Bash (for, while) and Iterating Files',
          'Bash Functions, Scope, and Return Codes',
          'Handling Arguments, Options, and Exit Codes',
          'Standard Input/Output, File Descriptors, and Redirections',
          'Advanced sed: Stream Editing Patterns and Scripting',
          'Advanced awk: Multi-field Extraction and Calculations',
          'Error Handling, Debugging, and Safe-Scripting (set -euo pipefail)',
          'Capstone Shell Automation: End-to-End System Health Script'
        ],
        subtopicsList: [
          ['#!/bin/bash', 'local vs env variables', 'read command', 'string operations'],
          ['string comparisons', 'integer operators (-eq, -lt)', 'file testers (-f, -d)', 'logical operators'],
          ['for loops', 'while loops', 'looping through array', 'processing file lines'],
          ['function declaration', 'local variables', 'return values', 'sharing utility functions'],
          ['$0 to $9 parameters', '$# count', '$@ and $* array expansion', 'getopts usage'],
          ['stdin (0), stdout (1), stderr (2)', 'tee command', 'heredocs', 'piping output'],
          ['sed pattern space', 'multi-line edits', 'substitutions', 'in-place writing'],
          ['awk FS and OFS', 'awk variables (NR, NF)', 'BEGIN and END blocks', 'associative arrays'],
          ['bash -x debugging', 'exit codes and error trapping', 'set flags', 'defensive programming'],
          ['modularizing scripts', 'formatting reports', 'sending email alerts', 'packaging bash scripts']
        ],
        practicalLabs: [
          'Write a script that prompts for a username and directory name, creating them with proper permissions.',
          'Build a script that tests if a remote host is pingable and verifies if port 22 is open.',
          'Create a loop script that processes all files in /var/log/ and backs up any ending in .log.',
          'Write a shell function that calculates disk space usage percentage and alerts if over 80%.',
          'Implement a CLI utility that parses arguments using getopts (e.g., -u for user, -d for directory).',
          'Redirect standard error from a failed network command to a hidden log file while showing standard output.',
          'Create a sed script that obfuscates database credentials in a configuration template file.',
          'Use awk to calculate the average response time of requests from an application log file.',
          'Refactor a buggy script using `set -euo pipefail` and add a custom trap handler for failures.',
          'Assemble all skills to write a modular health checking script that reports memory, CPU, disk, and network.'
        ],
        miniAssignments: [
          'Create a script to generate a secure random password generator.',
          'Write a script that validates if an email address or IP is formatted correctly using regex.',
          'Write a file batch-renamer script that changes extensions of files recursively.',
          'Build a math library script containing functions for sum, multiply, and average.',
          'Write a script that displays help text when run with no arguments or -h flag.',
          'Write a backup script that uses tar and gzip, outputting status to stdout and errors to syslog.',
          'Use sed to extract all comments from a source code file.',
          'Write an awk script that prints the names of all system accounts with UID > 1000.',
          'Write a bash wrapper that retries a connection command up to 5 times before failing.',
          'Deploy your system health checking script and schedule it to run every morning.'
        ],
        revisionTopics: [
          'Linux variables and path navigation',
          'Conditional syntax and exit codes',
          'Loops and lists structures',
          'Functions scoping in general programming',
          'CLI interface parameters',
          'Redirection streams (0, 1, 2)',
          'Text stream editing basics',
          'Pattern scanning and report generation',
          'Debugging techniques and process safety',
          'Shell orchestration and modular scripting'
        ],
        interviewQuestionsList: [
          ['Why is #!/bin/bash placed at the start of a script? What is it called?', 'What is the difference between local and environment variables?'],
          ['Explain the difference between [ ] and [[ ]] in bash conditions.', 'How do you check if a file exists and is readable in a script?'],
          ['What is the difference between using $* and $@ in bash loops?', 'How do you read a file line-by-line in a while loop?'],
          ['How do you return a value from a bash function? Explain exit status ranges.', 'Explain variable shadowing and local scope inside functions.'],
          ['What is the role of getopts? How do you handle optional parameters?', 'What does exit code 127 signify?'],
          ['Explain how to redirect stderr to stdout. What does 2>&1 mean?', 'What is the difference between > and >> operators?'],
          ['Explain how sed handles pattern spacing. How do you edit in-place?', 'Write a sed command to delete all blank lines in a file.'],
          ['What does the BEGIN block do in an awk script?', 'Explain NR and NF in awk with practical examples.'],
          ['What does set -euo pipefail do? Why is it crucial for production CI/CD scripts?', 'How do you capture signals and handle cleanup inside bash?'],
          ['How do you debug a bash script without editing the code?', 'What are the main drawbacks of shell scripts for complex systems?']
        ],
        githubCommits: [
          'feat: add random password generator script',
          'feat: add system network verification script',
          'feat: add automated log rotation and backup script',
          'feat: add baseline system health alert functions',
          'feat: add robust CLI argument parser utility',
          'feat: add advanced tar backup script with stderr redirection',
          'feat: add sed filter script for config templates',
          'feat: add awk-based access log traffic calculator',
          'feat: add bash error handling and trap template',
          'feat: add production-grade System Health Monitor script'
        ],
        difficulty: 'Hard'
      },
      {
        title: 'Networking & Version Control with Git',
        topics: [
          'OSI & TCP/IP Network Models: Ports, Sockets, and Interfaces',
          'IP Addressing, Routing Tables, DNS Resolution and Diagnostics',
          'Network Troubleshooting Utilities (netstat, ss, traceroute, tcpdump)',
          'Secure Shell Protocol: SSH Keys, Configs, Ports, and Tunneling',
          'HTTP Protocol, CURL, and Debugging Web APIs',
          'Git Basics: Working Directory, Staging Area, and Commits',
          'Git Branching & Merging: Fast-forward vs Three-way Merge',
          'Resolving Git Merge Conflicts and Git Rebase Workflows',
          'Collaborative Git: Remotes, Pull Requests, and Upstream Sync',
          'Advanced Git: Git Stash, Cherry-pick, Reset, Revert, and Hooks'
        ],
        subtopicsList: [
          ['Physical to Application layers', 'TCP vs UDP', 'Well-known ports', 'Network sockets'],
          ['CIDR notation', 'Gateway routing', 'DNS recursion', 'dig & nslookup commands'],
          ['ss socket connection states', 'traceroute hop latency', 'tcpdump packet capture', 'telnet/nc'],
          ['SSH key generation', 'SSH configuration file', 'SSH port forwarding', 'socks proxying'],
          ['HTTP request methods', 'HTTP headers', 'CURL debugging flags (-v, -I)', 'SSL/TLS handshakes'],
          ['git init', 'staging index', 'git status', 'writing clean commit messages'],
          ['branch lifecycle', 'git merge strategies', 'divergent histories', 'HEAD pointer movement'],
          ['merge conflict tags', 'git rebase vs merge', 'interactive rebase', 'force pushing risk'],
          ['git remote', 'tracking branches', 'git pull vs fetch', 'handling fork syncs'],
          ['git stash pop/apply', 'git cherry-pick commits', 'soft vs hard reset', 'git pre-commit hooks']
        ],
        practicalLabs: [
          'Identify active network sockets, bound ports, and running daemons on your local machine.',
          'Trace DNS queries for a domain, analyzing routing paths to understand latency blocks.',
          'Analyze connection attempts and capture raw HTTP packet requests using tcpdump.',
          'Configure passwordless SSH login, customize SSH port, and restrict root access.',
          'Inspect HTTP response headers, trace TLS handshakes, and download resources with CURL.',
          'Initialize a local repository, stage changes, commit with clean messages, and review logs.',
          'Create a feature branch, execute work, merge it to main, and clean up local branches.',
          'Simulate a merge conflict between two branches, resolve it manually, and commit the fix.',
          'Fork a remote repository, set up upstream remotes, and pull fresh changes to sync.',
          'Use git stash to toggle between bugs, cherry-pick a commit, and set up a pre-commit syntax hook.'
        ],
        miniAssignments: [
          'Write a network topology summary explaining the routing path from home to google.com.',
          'Calculate usable hosts inside a /24 and /27 subnet and construct routing tables.',
          'Write a netcat or telnet testing script to scan active ports on a host.',
          'Build an SSH config file managing connections for 5 production and staging servers.',
          'Write a curl command that tests API endpoints and alerts on HTTP status != 200.',
          'Write a git-log formatting alias to display branches in a beautiful tree structure.',
          'Write a markdown explanation on Git Flow vs GitHub Flow branching models.',
          'Perform an interactive rebase to squash 5 messy commits into a single clean commit.',
          'Write a guide on remote branch tracking, git push upstream, and conflict-free pulls.',
          'Write a pre-commit hook script that blocks commits containing the word "TODO" or keys.'
        ],
        revisionTopics: [
          'Networking hardware and IP routes',
          'DNS config and internet routing',
          'Port bindings and interface statuses',
          'SSH protocols and encryption keys',
          'Web protocols and API standards',
          'Git tracking and snapshot model',
          'Git trees and index states',
          'Interactive rebase and code conflicts',
          'Upstream branches and fetch lifecycles',
          'Git history rewriting and automation hooks'
        ],
        interviewQuestionsList: [
          ['What is the difference between TCP and UDP? Give examples of protocols using each.', 'Explain the 3-way handshake of TCP.'],
          ['Explain CIDR notation. What is the broadcast address of a 192.168.1.0/24 subnet?', 'How does DNS lookup resolve a domain name?'],
          ['How would you find which process is listening on port 80? Compare netstat and ss.', 'How does tcpdump capture packets and what is its overhead?'],
          ['Explain symmetric vs asymmetric encryption in SSH.', 'How do you secure an SSH server on a public cloud VM?'],
          ['What are the typical HTTP status code ranges? What does 503 Service Unavailable mean?', 'Explain the TLS handshake process.'],
          ['What is the difference between the staging area and the working directory in Git?', 'What is contained inside the .git folder?'],
          ['What is a fast-forward merge? When does Git perform a 3-way merge instead?', 'How does git diff show differences between index and HEAD?'],
          ['Compare git merge and git rebase. When should you NEVER rebase a branch?', 'How do you abort a merge conflict or an ongoing rebase?'],
          ['What is the difference between git fetch and git pull?', 'Explain how to keep a locally forked repository up to date.'],
          ['Explain the difference between git reset --soft, --mixed, and --hard.', 'How do git hooks work? Give a concrete use case in CI/CD.']
        ],
        githubCommits: [
          'feat: add network diagnosis report template',
          'feat: add subnetting and cidr calculation guide',
          'feat: add port scanner utility script using netcat',
          'feat: add multi-server production ssh configuration file',
          'feat: add curl website availability ping script',
          'feat: add git configurations and beautiful log aliases',
          'docs: add branching models and git-flow strategy comparison',
          'feat: add squashed and cleaned interactive rebase log',
          'docs: add collaborative remote branching cheat-sheet',
          'feat: add security and todo scanner git pre-commit hook'
        ],
        difficulty: 'Medium'
      }
    ]
  },
  {
    moduleName: 'Month 2: Containerization with Docker & Docker Compose',
    subModules: [
      {
        title: 'Docker Fundamentals, Volumes, Networking & Multi-Container Apps',
        topics: [
          'Containers vs Virtual Machines: Core Architecture & Docker Engine',
          'Docker Images: Storage Drivers, Layers, and the Build Cache',
          'Writing Optimized Dockerfiles: Multi-stage Builds and Security',
          'Docker Volumes, Bind Mounts, and Persistent Storage Management',
          'Docker Networking Part 1: Default Drivers (Bridge, Host, None)',
          'Docker Networking Part 2: Custom Networks & DNS Resolution',
          'Multi-Container Architecture: Docker Compose Configuration',
          'Docker Compose Lifecycle, Scaling, and Environment Variables',
          'Docker Registry: Managing Private Registries & Image Security',
          'Docker Production Best Practices, Logging, and Resource Constraints'
        ],
        subtopicsList: [
          ['Namespaces & Cgroups', 'Docker daemon vs containerd', 'CLI operations', 'Container lifecycles'],
          ['UnionFS / OverlayFS', 'Docker layers', 'Docker build context', 'Caching mechanics'],
          ['Base images selection', 'Multi-stage compilation', 'Rootless containers', 'Reducing image size'],
          ['Docker volumes lifecycle', 'Bind mounts use cases', 'Anonymous volumes', 'Data persistence rules'],
          ['Default bridge network', 'Host network performance', 'None network isolation', 'Container ports vs Host ports'],
          ['User-defined bridge networks', 'Automatic container DNS lookup', 'Overlay network overview', 'Connecting cross-networks'],
          ['docker-compose.yml structure', 'services, volumes, networks definitions', 'depends_on rules', 'build configuration'],
          ['docker compose up/down', 'scaling service instances', 'env_file inclusion', 'variable interpolation'],
          ['Docker Hub account setup', 'Local registry deployment', 'docker login/push', 'image vulnerability scanning'],
          ['Docker logs management', 'limiting CPU/Memory allocations', 'healthchecks in Docker', 'cleaning unused resources']
        ],
        practicalLabs: [
          'Install Docker, run basic Alpine containers, inspect container namespaces and resource cgroups.',
          'Build a basic Node/Python application image, inspect layer history, and analyze layer sizes.',
          'Refactor an application Dockerfile to utilize a multi-stage layout, reducing footprint by 80%.',
          'Configure a Docker container running PostgreSQL that persists data using a named volume.',
          'Create containers on default bridge and inspect port mapping and connectivity to localhost.',
          'Set up a custom bridge network, spin up 2 containers, and verify automatic host DNS resolution.',
          'Write a docker-compose.yml mounting Nginx as frontend and Node as backend backend databases.',
          'Deploy, scale an API service to 3 instances with Docker Compose, and toggle env configurations.',
          'Deploy a secure local Docker registry, tag a custom build, push it, and pull on another server.',
          'Implement memory limits on a memory-leaking container and configure journald docker log drivers.'
        ],
        miniAssignments: [
          'Draw a diagrams comparing Hypervisor VMs with Docker container runtimes.',
          'Create a step-by-step summary detailing Docker image layers caching optimization guidelines.',
          'Write a highly secure production-ready Dockerfile for a React and Spring Boot app.',
          'Build an automated Docker volume backup shell script that archives volume directories.',
          'Write a network isolation mapping showing how separate containers communicate on standard ports.',
          'Build a network configuration diagram explaining user-defined bridges and default interfaces.',
          'Create a 3-tier Docker Compose environment containing WordPress, MySQL, and Nginx proxy.',
          'Create an automated script that checks Compose service health and triggers scaling commands.',
          'Write a CI/CD pipeline step that scans images using Trivy and blocks on Critical issues.',
          'Produce a comprehensive Docker hygiene cron script that cleans dangling system assets weekly.'
        ],
        revisionTopics: [
          'Linux kernel namespace isolation',
          'Linux filesystem layers and storage',
          'Optimized scripting and automation files',
          'Linux filesystem mounting',
          'Network ports, protocols, and interfaces',
          'Subnets and DNS structures',
          'Web architecture and load balancing',
          'Scaling concepts and system environment config',
          'Repository secure connections and credentials',
          'System logs and container constraints limits'
        ],
        interviewQuestionsList: [
          ['How does Docker isolate containers? Explain namespaces, cgroups, and OverlayFS.', 'What is the role of containerd and runc?'],
          ['How do Docker image layers work? What is the impact of placing RUN commands in wrong order?', 'Explain UnionFS.'],
          ['Why should we use multi-stage builds? Explain how it enhances security and reduces size.', 'How do you run Docker without root privileges?'],
          ['What is the difference between a bind mount and a named volume? When would you use each?', 'How do you share files between two running containers?'],
          ['Explain the default bridge network in Docker. How does host networking bypass isolation?', 'What is port publishing (-p) vs exposing?'],
          ['How does automatic DNS resolution work in user-defined bridge networks?', 'How can two containers on separate Docker networks communicate?'],
          ['Explain the purpose of depends_on in Docker Compose. Does it guarantee application startup readiness?', 'How do you run docker-compose in background?'],
          ['How does Docker Compose handle environment variables? What is the precedence of .env files?', 'How do you scale a single service up/down?'],
          ['What is an image digest and why is it safer than an image tag?', 'How do you set up and authenticate with a private Docker registry?'],
          ['How do you limit a container to 500MB of RAM and 0.5 CPU cores?', 'How do you implement a healthcheck directly in a Dockerfile?']
        ],
        githubCommits: [
          'docs: add virtualization vs containerization architecture guide',
          'feat: add step-by-step image layers and build cache demo',
          'feat: add optimized multi-stage secure Dockerfiles',
          'feat: add postgres docker database script with named volumes',
          'feat: add default bridge network container ports tests',
          'feat: add isolated custom docker network and dns tester',
          'feat: add multi-container 3-tier docker compose configuration',
          'feat: add scaled docker compose cluster with environment settings',
          'feat: add private docker registry deployment scripts',
          'feat: add production docker container resource boundaries and cleanup cron'
        ],
        difficulty: 'Hard'
      }
    ]
  },
  {
    moduleName: 'Month 3: Cloud Infrastructure with AWS',
    subModules: [
      {
        title: 'AWS Foundations, IAM, Compute, Storage & CloudWatch Monitoring',
        topics: [
          'AWS Global Infrastructure: Regions, Availability Zones, and Edge Locations',
          'AWS Identity & Access Management (IAM): Users, Groups, and Policies',
          'AWS IAM Roles, Instance Profiles, and AWS CLI Configuration',
          'Amazon EC2: Instances, AMIs, Key Pairs, and User Data Scripts',
          'EC2 Security Groups: Firewall Protocols, Ingress, and Egress Rules',
          'Amazon EBS & EFS: Block and File Storage Solutions',
          'Amazon S3: Buckets, Object Lifecycles, Versioning, and Access Control',
          'Amazon VPC Part 1: CIDR, Subnets, Route Tables, and Internet Gateways',
          'Amazon VPC Part 2: NAT Gateway, Bastion Hosts, NACLs, and VPC Peering',
          'Amazon CloudWatch: System Metrics, Alarms, Logs, and Dashboard Alerts'
        ],
        subtopicsList: [
          ['AWS Global Network', 'High availability in AZs', 'Edge locations and CloudFront caching', 'Global vs Regional services'],
          ['IAM Users creation', 'IAM Groups policy inheritance', 'Inline vs Managed policies', 'JSON policy syntax'],
          ['IAM Roles for EC2 services', 'AWS CLI credentials configuration', 'AWS STS and temporary credentials', 'IAM Best Practices'],
          ['EC2 Instance families', 'AMI selection and virtualization type', 'EBS-backed vs Instance store', 'User Data automation scripts'],
          ['Security groups stateful nature', 'Ingress/Egress rules setup', 'Referencing security groups in rules', 'Network troubleshooting'],
          ['EBS volumes types (gp3, io2)', 'EBS snapshots lifecycle', 'EFS mount targets', 'Distributed file sharing in EC2'],
          ['S3 Storage classes', 'S3 Bucket policies and ACLs', 'Versioning and replication rules', 'Object lifecycle policies'],
          ['VPC CIDR calculation', 'Public vs Private subnets', 'Route table routes mapping', 'Internet Gateway association'],
          ['NAT Gateway implementation', 'Bastion host setup', 'Stateless NACLs vs stateful security groups', 'VPC Peering routes config'],
          ['CloudWatch EC2 default metrics', 'Custom metrics push', 'Log Agent installation and capture', 'CloudWatch Alarms configuration']
        ],
        practicalLabs: [
          'Explore AWS Global infrastructure console, identify closest low-latency region, launch cloud-shell.',
          'Create a DevOps IAM group, write a JSON policy granting read-only EC2 access, assign to a user.',
          'Configure AWS CLI locally, write a script to launch an IAM Role, attach to EC2.',
          'Launch an Amazon EC2 Linux instance, execute automated Nginx web installations via EC2 User Data.',
          'Create a web security group allowing port 80/443, and configure ssh locks restricted to your IP.',
          'Create and attach a gp3 EBS storage volume to an EC2 instance, mount it, and create directories.',
          'Create an S3 bucket, configure versioning, upload files, and write an object lifecycle policy.',
          'Create a custom VPC, add a public subnet, add an Internet Gateway, map route table paths.',
          'Deploy a private subnet, configure NAT Gateway, launch EC2, connect securely via Bastion host.',
          'Deploy CloudWatch agent on EC2, stream system logs, set up an alarm alerting on High CPU > 80%.'
        ],
        miniAssignments: [
          'Write a high-availability design plan for an app leveraging multiple AWS Regions and AZs.',
          'Write a secure JSON IAM Policy that allows S3 uploads but blocks deletions.',
          'Write a bash script using AWS CLI to automatically stop running EC2 instances with "Dev" tag.',
          'Build an EC2 User Data script that configures a complete node application with dynamic env variables.',
          'Write a security group policy analysis matrix comparing Stateful SGs with Stateless NACLs.',
          'Write an EBS backup script using AWS CLI that creates snapshots of attached EBS drives daily.',
          'Create a bucket access control checklist verifying public vs private objects structures.',
          'Design a VPC Network Topology Diagram outlining subnets, routing tables, and gateway paths.',
          'Write a NAT Gateway cost-optimization study comparing NAT instances with AWS NAT Gateways.',
          'Set up a custom CloudWatch metric that monitors web-request response speeds.'
        ],
        revisionTopics: [
          'Cloud concepts and shared responsibility',
          'JSON structures and user governance',
          'Access keys and secure shell concepts',
          'Linux server orchestration and web servers',
          'Firewalls and network security protocols',
          'File mounting and block level storage',
          'File management and access control systems',
          'CIDR mapping and routing rules',
          'Network gateways, bastion architecture and NACLs',
          'System monitoring, diagnostic metrics and alarm configurations'
        ],
        interviewQuestionsList: [
          ['What is the difference between a Region, an Availability Zone, and an Edge Location?', 'How does AWS guarantee high availability inside an AZ?'],
          ['Explain IAM policy inheritance. What is the explicit deny rule?', 'Write a basic JSON IAM policy allowing S3 Read access.'],
          ['What is an IAM Role? Why is it safer than using AWS Access Keys inside EC2 instances?', 'Explain the AWS Security Token Service (STS).'],
          ['What is EBS-backed vs Instance Store EC2? Which one is ephemeral and why?', 'How does User Data run on an EC2 instance?'],
          ['Explain the stateful nature of Security Groups. What happens to response traffic?', 'How do you allow EC2 instances in SG-A to reach SG-B?'],
          ['Compare EBS and EFS. In what scenarios would you choose EFS over EBS?', 'How do EBS snapshots work? What is incremental backup?'],
          ['Explain Amazon S3 storage classes (Standard, IA, Glacier). How do lifecycle policies save costs?', 'What is S3 object lock?'],
          ['Describe the main components of an AWS VPC. What makes a subnet public vs private?', 'What CIDR blocks are reserved by AWS in a subnet?'],
          ['What is the difference between a Security Group and a Network ACL (NACL)? Give 3 differences.', 'Explain the purpose of a NAT Gateway.'],
          ['What default metrics does CloudWatch track for EC2 instances? Why does it not track RAM usage?', 'How does a CloudWatch Alarm trigger?']
        ],
        githubCommits: [
          'docs: add aws global infrastructure high-availability model',
          'feat: add standard secure JSON IAM policy templates',
          'feat: add aws cli automated administration shell scripts',
          'feat: add ec2 provisioning scripts and user data automated setup',
          'feat: add security groups ingress and egress architecture maps',
          'feat: add ebs storage mounting and snapshot shell backup script',
          'feat: add s3 static hosting configuration and lifecycle JSON',
          'feat: add custom cloud vpc design and subnet configuration scripts',
          'feat: add bastion host and nat gateway private subnet routing',
          'feat: add cloudwatch custom logs agent config and alerts'
        ],
        difficulty: 'Medium'
      }
    ]
  },
  {
    moduleName: 'Month 4: Continuous Integration & Deployment (CI/CD)',
    subModules: [
      {
        title: 'Jenkins Pipelines, GitHub Actions, and Deployment Pipelines',
        topics: [
          'CI/CD Core Concepts: Software Delivery Lifecycles and Automation',
          'Jenkins Installation, Configuration, and User Authorization',
          'Jenkins Declarative Pipelines: Structure, Stages, and Steps',
          'Jenkins Integration: GitHub Webhooks, Credentials, and Triggers',
          'Jenkins Master-Agent Architecture: Configuring Distributed Builds',
          'GitHub Actions Fundamentals: Workflows, Actions, and Runners',
          'GitHub Actions Secrets Management, Environments, and Variables',
          'Advanced GitHub Actions: Reusable Workflows and Matrix Builds',
          'Integrating Security & Quality Gates: SonarQube, Trivy, and SAST',
          'Deploying Applications: Dockerizing CI/CD Builds and Deployments'
        ],
        subtopicsList: [
          ['Continous Integration definition', 'Continuous Delivery vs Deployment', 'Pipeline phases', 'Automation metrics'],
          ['Jenkins Java runtime requirement', 'Unlocking initial admin setup', 'Role-based access controls', 'Plugin manager'],
          ['Declarative vs Scripted syntax', 'pipeline, agent, stages, steps blocks', 'post actions (success, failure)', 'environment maps'],
          ['Webhook events setup in GitHub', 'ssh credentials storage', 'git checkout step', 'build triggers'],
          ['Master node overhead', 'SSH/JNLP agent connections', 'Docker-based build agents', 'Workspace isolation'],
          ['.github/workflows layout', 'jobs, steps, runs-on configurations', 'marketplace actions usage', 'runner types (hosted vs self-hosted)'],
          ['Repository Secrets', 'Environment-specific secrets', 'Context variables (${{ github }})', 'Default environment variables'],
          ['Reusable workflows syntax', 'Workflow call triggers', 'Matrix strategy runs', 'Staging build matrices'],
          ['SAST tools configuration', 'SonarQube quality gates integration', 'Container image scanning with Trivy', 'Vulnerability alerts'],
          ['Building Docker images in CI', 'Pushing to registries in pipeline', 'Automated host deployments', 'Post-deployment checks']
        ],
        practicalLabs: [
          'Design an automation lifecycle map showing software build to deployment stages.',
          'Install Jenkins inside a Docker container, unlock console, configure core credential keys.',
          'Write a Jenkinsfile managing pipeline blocks, executing tests, and producing outputs.',
          'Set up automatic Jenkins triggers via GitHub Webhooks upon repository branch pushes.',
          'Set up a separate Linux VM as a Jenkins build agent, connecting it to master.',
          'Write a GitHub Actions workflow that executes on branch pulls, verifying lint.',
          'Configure a GitHub Actions workflow integrating environment secrets, executing secure shell logins.',
          'Write a matrix-based GitHub Actions file compiling application versions across Node 18, 20, 22.',
          'Integrate Trivy container scans inside your GitHub Actions, failing on critical vulnerability finds.',
          'Deploy a complete CI/CD pipeline building, pushing a Docker image, and deploying it on remote host.'
        ],
        miniAssignments: [
          'Write a design paper comparing Jenkins (Self-Hosted) with GitHub Actions (SaaS SaaS-based CI).',
          'Write a shell script that automates the initial installations of Jenkins on Ubuntu.',
          'Build a Jenkins Declarative Pipeline template incorporating parallel stage runs.',
          'Create a webhook setup configuration document outlining network routes.',
          'Write a step-by-step master-agent connection guide using SSH keys.',
          'Create a GitHub Actions starter template testing 3 different code languages.',
          'Write a security guide explaining how to secure CI/CD runners and restrict secrets access.',
          'Build a modular reusable workflow structure in a public GitHub sandbox repository.',
          'Deploy a static SonarQube container and run a local analysis scan on a mock project.',
          'Create a complete continuous deployment diagram showing rollback fallback architectures.'
        ],
        revisionTopics: [
          'Software delivery metrics and workflows',
          'Linux packages and secure web portals',
          'Declarative programming and automation scripts',
          'Git webhook structures and triggers',
          'SSH connection structures and node configurations',
          'YAML schema and server runtime systems',
          'Environment configurations and variables management',
          'Matrix scaling and reusability rules',
          'Vulnerability scanning and metrics evaluation',
          'Containerized builds and delivery deployment pipelines'
        ],
        interviewQuestionsList: [
          ['What is the difference between Continuous Delivery and Continuous Deployment?', 'What are the main benefits of CI/CD?'],
          ['What is the default port Jenkins runs on? How do you change it?', 'What are Jenkins plugins and why are they risky?'],
          ['Explain Jenkins Declarative vs Scripted pipelines. Which is preferred and why?', 'What is the role of the "post" block in Jenkinsfile?'],
          ['How do you configure a GitHub webhook for Jenkins? What is payload url?', 'How does Jenkins securely store sensitive passwords?'],
          ['Why should you not run builds on the Jenkins Master node? How do Agents connect?', 'What is a JNLP agent?'],
          ['Explain GitHub Actions Workflow, Job, and Step. How do they run in parallel?', 'What is a GitHub self-hosted runner?'],
          ['How do you protect production secrets in GitHub Actions? Explain Environments.', 'What does ${{ secrets.GITHUB_TOKEN }} do?'],
          ['What is a reusable workflow in GitHub Actions? Compare with workflow templates.', 'How does a matrix build strategy work?'],
          ['What is static application security testing (SAST)? How do you integrate it in CI?', 'How does SonarQube check Quality Gates?'],
          ['How do you securely build and push a Docker image inside a GitHub Actions runner?', 'How do you handle rolling deployments in CI/CD?']
        ],
        githubCommits: [
          'docs: add enterprise ci/cd delivery pipeline strategy',
          'feat: add automated shell script installing jenkins',
          'feat: add declarative jenkinsfile with parallel testing stages',
          'feat: add webhook integration and trigger documentation',
          'feat: add jenkins distributed agent connection templates',
          'feat: add default github actions test workflows',
          'feat: add environment-specific github secrets maps',
          'feat: add reusable github actions workflow and matrix compilation',
          'feat: add sonarqube scan and trivy image audit pipeline',
          'feat: add continuous delivery automation build pipeline scripts'
        ],
        difficulty: 'Hard'
      }
    ]
  },
  {
    moduleName: 'Month 5: Orchestration with Kubernetes & Helm',
    subModules: [
      {
        title: 'Kubernetes Architecture, Core Resources, Storage, Ingress & Helm',
        topics: [
          'Kubernetes Architecture: Control Plane Components and Worker Nodes',
          'Kubectl CLI Masterclass: Essential Commands, Contexts, and Formatting',
          'Kubernetes Pods Lifecycle, Multi-container Pods, and Init Containers',
          'Kubernetes Controllers: ReplicaSets and Declarative Deployments',
          'Kubernetes Networking: ClusterIP, NodePort, and LoadBalancer Services',
          'Kubernetes Storage: Volumes, Persistent Volumes (PV), and PVCs',
          'Kubernetes Configuration: Managing App Data with ConfigMaps & Secrets',
          'Kubernetes Ingress Controllers: Traffic Routing, Paths, and TLS',
          'Helm Package Manager: Chart Structure, Templates, and Variables',
          'Helm Release Management, Rollbacks, and Custom Chart Creation'
        ],
        subtopicsList: [
          ['API Server, etcd, Scheduler, Controller Manager', 'Kubelet & Kube-proxy', 'Container Runtime Interface', 'Etcd backup'],
          ['kubectl config', 'Namespace isolation', 'output formatting (jsonpath, custom-columns)', 'dry-run generation'],
          ['Pod phases (Pending, Running, Failed)', 'Init Containers sequence', 'Sidecar container pattern', 'Pod resource requests/limits'],
          ['Replication controllers', 'Rolling Updates & Rollbacks strategies', 'Deployment YAML structure', 'Scaling deployments'],
          ['K8s networking model', 'ClusterIP service mapping', 'NodePort port allocations', 'LoadBalancer cloud integrations'],
          ['Volume types (emptyDir, hostPath)', 'PersistentVolumes life cycle', 'PersistentVolumeClaims matching', 'StorageClasses provisioning'],
          ['ConfigMaps creation and injection', 'Secrets encoding (base64)', 'Injecting config as env or volumes', 'Secret rotation'],
          ['Ingress resources vs Services', 'Nginx Ingress controller installation', 'Host-based and path-based routing', 'SSL termination'],
          ['Helm repository installation', 'Chart.yaml, values.yaml structure', 'Helm templating engine functions', 'Dry-run template rendering'],
          ['helm install/upgrade', 'helm rollback release', 'helm dependency management', 'packaging charts']
        ],
        practicalLabs: [
          'Spin up a Minikube cluster, inspect running control plane components in kube-system namespace.',
          'Create namespaces, switch context using kubectl, and write custom filters using jsonpath.',
          'Deploy a pod featuring an init container that generates an index file before Nginx starts.',
          'Deploy an application deployment, trigger a rolling update to v2, and perform a rollback to v1.',
          'Create a NodePort and ClusterIP service to route traffic across running container pods.',
          'Provision a PersistentVolume, write a PersistentVolumeClaim, mount it inside a container pod.',
          'Create ConfigMaps and base64-encoded Secrets, and inject them as environment variables inside pods.',
          'Install Nginx Ingress Controller, configure path-based routing rules, and map hosts to Minikube IP.',
          'Install a chart from Helm hub, customize values.yaml, and verify deployment.',
          'Write a completely custom Helm chart for a Node.js web app, package it, and execute rolling upgrades.'
        ],
        miniAssignments: [
          'Draw an architectural layout showing K8s Control Plane interaction with Worker Nodes.',
          'Write a kubectl CLI cheat-sheet containing 30 critical administrative commands.',
          'Create a YAML configuration for a Pod with a log-shipper sidecar container.',
          'Write a rolling-update strategies comparison matrix (Recreate vs RollingUpdate).',
          'Design a service networking flow chart tracking a packet from local browser to container Pod.',
          'Write a storage guide explaining dynamic volume provisioning with StorageClasses.',
          'Write a python/bash utility that auto-generates K8s Secrets base64 mappings safely.',
          'Build an Ingress YAML config defining path routing for static, api, and login paths.',
          'Create a values.yaml config customizing resources, replica counts, and ingress hosts.',
          'Build a custom Helm library including standard helpers for ingress and deployments.'
        ],
        revisionTopics: [
          'Orchestration concepts and container clustering',
          'CLI administration tools and namespaces',
          'Application lifecycles and initialization states',
          'Deployment states, rolling updates and rollbacks',
          'Cluster routing, services, and load balancers',
          'Mounting storages and stateful environments',
          'Application environment variables and secret encodings',
          'Reverse proxy routing, pathways and SSL security',
          'Package managers and templating architectures',
          'Rollback systems, dependency management and package lifecycles'
        ],
        interviewQuestionsList: [
          ['Explain the role of etcd in a Kubernetes cluster. What happens if etcd goes down?', 'What is the function of the Kube-Scheduler?'],
          ['What is the difference between imperative and declarative commands in Kubectl?', 'How do you view log lines of a previous container crash?'],
          ['Explain the lifecycle phases of a Kubernetes Pod.', 'What is an Init Container and how does it differ from a standard container?'],
          ['Explain how RollingUpdate strategy works in Kubernetes Deployments. How does maxSurge control scaling?', 'What is maxUnavailable?'],
          ['What is ClusterIP vs NodePort vs LoadBalancer service types? When do you use each?', 'What is Kube-Proxy?'],
          ['Describe PV, PVC, and StorageClass. How does dynamic storage provisioning work?', 'What is the reclaim policy of a PersistentVolume?'],
          ['Are Kubernetes Secrets encrypted by default? How do you secure them in production?', 'Explain ConfigMaps.'],
          ['What is an Ingress Controller? How does it differ from a LoadBalancer service?', 'How do you configure SSL redirection in Ingress?'],
          ['What is Helm? Why is it considered the "apt-get" for Kubernetes?', 'Describe the structure of a Helm Chart.'],
          ['How do you perform rollbacks in Helm? What does helm history show?', 'What is the purpose of Chart.lock?']
        ],
        githubCommits: [
          'docs: add kubernetes cluster control plane system design',
          'feat: add kubectl contexts and jsonpath formatting cheat-sheet',
          'feat: add multi-container sidecar and init container pod configs',
          'feat: add declarative deployments rolling-update templates',
          'feat: add nodeport and clusterip network service configs',
          'feat: add pv and pvc persistent storage pod mounts',
          'feat: add configmaps and base64 database secrets yaml',
          'feat: add nginx ingress routing paths and tls configs',
          'feat: add helm repository installation and settings logs',
          'feat: add custom webapp helm chart release templates'
        ],
        difficulty: 'Hard'
      }
    ]
  },
  {
    moduleName: 'Month 6: Infrastructure as Code, Monitoring & Final Preparation',
    subModules: [
      {
        title: 'Terraform, Prometheus, Grafana, Capstone & Career Strategy',
        topics: [
          'Infrastructure as Code (IaC) Concepts & Terraform Core Architecture',
          'Terraform Providers, Resources, Variables, and Output Configuration',
          'Terraform State Management, Locking, and Configuring Remote Backends',
          'Terraform Modules: Writing Reusable, Structured Infrastructure',
          'Prometheus Architecture: Time-series DB, Metrics scraping, and Alertmanager',
          'Grafana Dashboard Masterclass: Visualizing Metrics & Setting Alarms',
          'Centralized Logging Foundations: Elasticsearch, Fluentd, Kibana (EFK) or Loki',
          'Capstone DevOps Project: Complete GitOps/IaC Kubernetes Deployment',
          'DevOps Professional Resume Refinement and GitHub Portfolio Optimization',
          'Interview Preparation: Core DevOps Technical Scenarios, System Design, and Behavioral Mock Questions'
        ],
        subtopicsList: [
          ['Declarative vs Imperative IaC', 'Terraform CLI lifecycle', 'Terraform state file (.tfstate)', 'Idempotency in IaC'],
          ['Terraform Provider configuration', 'Resource dependency graph', 'Input variables syntax', 'Output parameters'],
          ['Local vs Remote state storage', 'S3 backend state storage', 'DynamoDB state locking', 'State drift detection'],
          ['Writing custom modules', 'Module inputs and outputs', 'Terraform registry usage', 'Standard directory structures'],
          ['Prometheus pull-model scraping', 'PromQL queries foundations', 'Node exporter metrics collector', 'Alertmanager configuration'],
          ['Grafana data source connection', 'Designing dashboards panels', 'Prometheus query plotting', 'Grafana alerting rules'],
          ['Log aggregators comparison', 'Loki vs ELK stack', 'FluentBit / Promtail forwarding', 'Log query syntax (LogQL)'],
          ['Assembling VPC, EC2, K8s, CI/CD, and IaC', 'Deploying monitoring metrics', 'Automating deployments with GitOps', 'Full project verification'],
          ['Highlighting AWS, K8s, Docker, Terraform on resume', 'Structuring star projects', 'GitHub readme profiles', 'Building portfolios'],
          ['DevOps system design cases', 'Analyzing site outages', 'Production support to DevOps story', 'Final reviews']
        ],
        practicalLabs: [
          'Install Terraform, write a main.tf file, run terraform init and check local files.',
          'Write terraform plans deploying an EC2 instance with custom security group configurations.',
          'Configure Terraform to store state files inside an S3 bucket with DynamoDB locking.',
          'Create a reusable Terraform module that provisions custom, isolated VPC networks.',
          'Install Prometheus via Helm, deploy Node Exporter, scrape system host metrics.',
          'Install Grafana, connect to Prometheus, and build a beautiful CPU/Memory monitoring panel.',
          'Deploy Grafana Loki and Promtail, scrape server syslog files, query logs in Grafana.',
          'Deploy the complete DevOps Capstone app: Provision infrastructure with Terraform, build with GitHub Actions, deploy to Kubernetes, monitor with Prometheus.',
          'Build a highly professional, markdown DevOps resume and write README pages for top projects.',
          'Conduct comprehensive DevOps scenario-based reviews, solving system outage mocks.'
        ],
        miniAssignments: [
          'Write an architectural summary detailing why Terraform is preferred over CloudFormation.',
          'Write a terraform script defining variables with validation constraints rules.',
          'Build a step-by-step remote backend configuration guide with backup strategies.',
          'Create a modular terraform structure managing dev, staging, and prod environments.',
          'Write a cheat-sheet of 10 essential PromQL functions for checking error rates.',
          'Create a custom JSON dashboard template ready for Grafana imports.',
          'Write a logging agent config file (Promtail/Fluentbit) collecting web logs.',
          'Generate a high-fidelity system design diagram of the complete Capstone architecture.',
          'Write an optimized DevOps cover letter template tailored for transition roles.',
          'Write a document summarizing solutions for 10 critical live DevOps interview cases.'
        ],
        revisionTopics: [
          'Infrastructure configuration standards',
          'Declarative environments and variable validation',
          'State files security and locking concurrency',
          'Reusable code structures and modular designs',
          'Time series metrics, pulling mechanisms and scraping configs',
          'Metrics analytics, graphs design and alerts configurations',
          'Log forwarding pipelines and centralized storages',
          'Full-stack system orchestration and capstones',
          'Technical experience storytelling and resume profiles',
          'DevOps systems design, outage triage and interview methodologies'
        ],
        interviewQuestionsList: [
          ['How does Terraform track infrastructure state? What happens if you lose the state file?', 'Is Terraform declarative or imperative?'],
          ['What is a provider in Terraform? How do you manage provider versions?', 'How do you handle resource dependencies in Terraform?'],
          ['Why should you use remote state storage? Why is DynamoDB required for state locking in S3 backend?', 'What is state drift?'],
          ['What is a Terraform module? How do you pass variables into child modules?', 'Explain standard Terraform directory layout.'],
          ['Explain Prometheus push vs pull models. When is pull model better?', 'Describe the main components of Prometheus architecture.'],
          ['How do you create Grafana dashboards from Prometheus queries? What is PromQL?', 'How do Grafana alerts trigger?'],
          ['Compare Elasticsearch, Logstash, Kibana (ELK) with Grafana Loki.', 'How do you query logs in Loki using LogQL?'],
          ['Walk through your DevOps Capstone project. How did you connect Terraform, CI/CD, and Kubernetes?', 'What challenges did you solve?'],
          ['How do you quantify accomplishments on a DevOps resume?', 'What key skills must be visible on the first half-page?'],
          ['How would you troubleshoot a web application that suddenly returns 502 Bad Gateway?', 'Explain a blue-green deployment strategy.']
        ],
        githubCommits: [
          'docs: add infrastructure-as-code terraform core concepts',
          'feat: add custom terraform configurations for basic ec2',
          'feat: add s3 remote state and dynamodb locking backend tf',
          'feat: add custom reusable terraform vpc module template',
          'feat: add prometheus installation and promql cheat-sheet',
          'feat: add grafana system monitoring dashboard configuration JSON',
          'feat: add loki and promtail centralized logging agent setups',
          'feat: add complete devops capstone cluster deployment scripts',
          'docs: add professional devops transition resume template',
          'docs: add devops technical scenario-based system design answers'
        ],
        difficulty: 'Hard'
      }
    ]
  }
];

export function generate180DayRoadmap(startDateStr: string, preferredRevisionDay: string): RoadmapDay[] {
  const roadmap: RoadmapDay[] = [];
  const start = new Date(startDateStr);
  const preferredDayIndex = getDayOfWeekIndex(preferredRevisionDay);

  let currentDay = 1;
  let syllabusIndex = 0;
  let subModuleIndex = 0;
  let topicIndex = 0;

  // Track dates including weekends
  const dateCursor = new Date(start);

  while (currentDay <= 180) {
    // Determine module and syllabus details
    const module = SYLLABUS[syllabusIndex];
    const subModule = module.subModules[subModuleIndex];
    const moduleName = module.moduleName;

    const topic = subModule.topics[topicIndex];
    const subtopics = subModule.subtopicsList[topicIndex];
    const practicalLab = subModule.practicalLabs[topicIndex];
    const miniAssignment = subModule.miniAssignments[topicIndex];
    const revisionTopic = subModule.revisionTopics[topicIndex];
    const interviewQuestions = subModule.interviewQuestionsList[topicIndex];
    const githubCommit = subModule.githubCommits[topicIndex];
    const difficulty = subModule.difficulty;

    // Check if current dateCursor is the Preferred Revision Day
    const isRevisionDay = dateCursor.getDay() === preferredDayIndex;

    const formattedDate = dateCursor.toISOString().split('T')[0];

    if (isRevisionDay) {
      // Create a Revision Day
      roadmap.push({
        dayNumber: currentDay,
        module: moduleName,
        topic: `Weekly Review: ${subModule.title} (Practice & Mock Interview)`,
        subtopics: [
          'Review the past week\'s core lessons and technical deep-dives',
          'Complete any unfinished or partial practical labs from this module',
          'Run a full local troubleshooting practice session',
          'Engage in mock interview question practice with your DevOps Mentor'
        ],
        estimatedTime: '3-4 hours',
        practicalLab: 'Re-run the most challenging lab of the past week from scratch under 30 minutes.',
        miniAssignment: 'Conduct a self-audit of your GitHub repository commits for this week and polish documentation.',
        revisionTopic: 'Consolidation of the past week\'s topics',
        interviewQuestions: [
          'What was the most challenging technical block you faced this week, and how did you resolve it?',
          'Summarize the core operational advantages of the tools you mastered over the last 6 days.'
        ],
        githubCommit: 'docs: update weekly devops progress logs and revision summaries',
        difficulty: 'Medium',
        status: 'Pending',
        targetDate: formattedDate,
        completionDate: null,
        rescheduledCount: 0,
        delay: 0
      });
    } else {
      // Create a Standard syllabus Day
      roadmap.push({
        dayNumber: currentDay,
        module: moduleName,
        topic: `${subModule.title}: ${topic}`,
        subtopics,
        estimatedTime: '2-3 hours',
        practicalLab,
        miniAssignment,
        revisionTopic,
        interviewQuestions,
        githubCommit,
        difficulty,
        status: 'Pending',
        targetDate: formattedDate,
        completionDate: null,
        rescheduledCount: 0,
        delay: 0
      });

      // Increment syllabus pointers for standard days
      topicIndex++;
      if (topicIndex >= subModule.topics.length) {
        topicIndex = 0;
        subModuleIndex++;
        if (subModuleIndex >= module.subModules.length) {
          subModuleIndex = 0;
          syllabusIndex++;
          if (syllabusIndex >= SYLLABUS.length) {
            // Roll back to the beginning or loop if out of bounds (should not happen for 180 days with this dense list)
            syllabusIndex = 0;
          }
        }
      }
    }

    // Move date cursor and day count
    dateCursor.setDate(dateCursor.getDate() + 1);
    currentDay++;
  }

  return roadmap;
}

function getDayOfWeekIndex(dayName: string): number {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const index = days.findIndex(d => d.toLowerCase() === dayName.toLowerCase());
  return index !== -1 ? index : 0; // Default to Sunday
}
