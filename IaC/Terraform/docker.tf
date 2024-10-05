resource "proxmox_vm_qemu" "docker-master" {
  count = 3
  name = "Docker-Master-${count.index + 1}"
  vmid = 300 + count.index
  desc = "Docker Master Node ${count.index + 1}, created by Terraform on ${local.buildtime}"
  target_node = var.proxmox_node
  clone = var.cloudinit_template_name
  full_clone = true
  pool = "docker-masters"
  onboot = true
  agent = 1
  os_type = "cloud-init"
  cores = 4
  sockets = 1
  cpu = "host"
  memory = 4096
  scsihw = "virtio-scsi-pci"
  bootdisk = "scsi0"
  vm_state = "running"

  disks {
    scsi {
      scsi0 {
        cloudinit {
          storage = "Group_4"
        }
      }

      scsi1 {
        disk {
          size = "100G"
          emulatessd = true
          storage = "Group_3"
        }
      }
    }
  }

  network {
    model = "virtio"
    bridge = "vmbr0"
    firewall = true
    queues = 4
  }

  lifecycle {
    ignore_changes = [
      network,
    ]
  }

  ipconfig0 = "ip=192.168.86.5${count.index}/24,gw=192.168.86.1"
  searchdomain = "docker_master.local.sinlessgamesllc.com"
  nameserver = "1.1.1.1"

  ssh_user = "sinless777"
  sshkeys = <<EOF
  ${var.ssh_key}
  EOF

}

resource "proxmox_vm_qemu" "docker-workers" {
  count = 3
  name = "Docker-Worker-${count.index + 1}"
  vmid =  350 + count.index
  desc = "Docker Worker Node ${count.index + 1}, created by Terraform on ${local.buildtime}"
  target_node = var.proxmox_node
  clone = var.cloudinit_template_name
  full_clone = true
  pool = "docker-workers"
  onboot = true
  agent = 1
  os_type = "cloud-init"
  cores = 4
  sockets = 1
  cpu = "host"
  memory = 4096
  scsihw = "virtio-scsi-pci"
  bootdisk = "scsi0"
  vm_state = "running"

  disks {
    scsi {
      scsi0 {
        cloudinit {
          storage = "Group_4"
        }
      }

      scsi1 {
        disk {
          size = "100G"
          emulatessd = true
          storage = "Group_3"
        }
      }
    }
  }

  network {
    model = "virtio"
    bridge = "vmbr0"
    firewall = true
    queues = 4
  }

  lifecycle {
    ignore_changes = [
      network,
    ]
  }

  ipconfig0 = "ip=192.168.86.${70 + count.index}/24,gw=192.168.86.1"
  searchdomain = "docker_worker.local.sinlessgamesllc.com"
  nameserver = "1.1.1.1"

  ssh_user = "sinless777"
  sshkeys = <<EOF
  ${var.ssh_key}
  EOF

}
