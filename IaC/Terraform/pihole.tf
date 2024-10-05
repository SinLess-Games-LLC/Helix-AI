resource "proxmox_vm_qemu" "pihole_1" {
  name = "Pihole-1"
  vmid = 100
  desc = "Pihole Server 1, created by Terraform on ${local.buildtime}"
  target_node = var.proxmox_node
  clone = var.cloudinit_template_name
  full_clone = true
  onboot = true
  agent = 1
  os_type = "cloud-init"
  cores = 4
  sockets = 1
  cpu = "host"
  memory = 8192
  scsihw = "virtio-scsi-pci"
  bootdisk = "scsi0"
  pool = "pihole"

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

  ipconfig0 = "ip=192.168.86.80/24,gw=192.168.86.1"
  searchdomain = "pihole_1.local.sinlessgamesllc.com"
  nameserver = "1.1.1.1"

  ssh_user = "sinless777"
  sshkeys = <<EOF
  ${var.ssh_key}
  EOF

}

resource "proxmox_vm_qemu" "pihole_2" {
  name = "Pihole-2"
  vmid = 101
  desc = "Pihole Server 2, created by Terraform on ${local.buildtime}"
  target_node = var.proxmox_node
  clone = var.cloudinit_template_name
  full_clone = true
  onboot = true
  agent = 1
  os_type = "cloud-init"
  cores = 4
  sockets = 1
  cpu = "host"
  memory = 8192
  scsihw = "virtio-scsi-pci"
  bootdisk = "scsi0"
  pool = "pihole"

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

  ipconfig0 = "ip=192.168.86.81/24,gw=192.168.86.1"
  searchdomain = "pihole_2.local.sinlessgamesllc.com"
  nameserver = "1.1.1.1"

  ssh_user = "sinless777"
  sshkeys = <<EOF
  ${var.ssh_key}
  EOF

}
