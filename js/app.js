document.addEventListener("DOMContentLoaded", function () {
  // Login
  const loginForm = document.querySelector("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const user = document.getElementById("username").value.trim();
      const pin = document.getElementById("password").value.trim();
      if (user === "Admin" && pin === "151567") {
        localStorage.setItem("usuarioNombre", user);
        window.location.href = "home.html";
      } else {
        alert("Usuario o PIN incorrecto.");
      }
    });
    return;
  }

  // Home - Mostrar usuario
  const welcomeHeader = document.querySelector(".welcome-text");
  const savedUser = localStorage.getItem("usuarioNombre");
  if (welcomeHeader && savedUser) {
    welcomeHeader.innerHTML = `Bienvenido/a ${savedUser}!`;
  }

  // Home - Asignar paginas
  const ruta = {
    depositarBtn: "deposito.html",
    retirarBtn: "retiro.html",
    consultarBtn: "consultar.html",
    historialBtn: "historial.html",
    serviciosBtn: "servicios.html",
    salirBtn: "index.html",
  };

  // Asigna listeners a cada botón
  Object.entries(ruta).forEach(([id, url]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        window.location.href = url;
      });
    }
  });

  // Saldo actual
  const saldoActualSpan = document.getElementById("saldo-actual");
  if (saldoActualSpan) {
    const saldo = parseInt(localStorage.getItem("saldo"), 10) || 0;
    saldoActualSpan.textContent = "$ " + saldo;
  }

  // Deposito
  const welcomeDeposito = document.getElementById("cuenta-nombre");
  if (welcomeDeposito && savedUser) {
    welcomeDeposito.innerHTML = `${savedUser}`;
  }
  const depositoForm = document.querySelector("#deposito-form");
  if (depositoForm) {
    depositoForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const monto = parseInt(
        document.getElementById("deposit-amount").value,
        10
      );
      const concepto = document.getElementById("deposit-concept").value;
      if (!isNaN(monto) && monto > 0) {
        let saldo = parseInt(localStorage.getItem("saldo"), 10) || 0;
        saldo += monto;
        localStorage.setItem("saldo", saldo);

        let historial = JSON.parse(localStorage.getItem("historial")) || [];
        historial.push({
          tipo: "Depósito",
          monto: monto,
          concepto: concepto,
          usuario: savedUser,
          fecha: new Date().toLocaleString(),
        });
        localStorage.setItem("historial", JSON.stringify(historial));

        alert("¡Depósito realizado con éxito!");
        window.location.href = "home.html";
      } else {
        alert("Ingrese un monto válido.");
      }
    });
  }

  // Retiros
  const retiroForm = document.getElementById("retiro-form");
  if (retiroForm) {
    retiroForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const monto = parseInt(
        document.getElementById("retiro-amount").value,
        10
      );
      const concepto = document.getElementById("retiro-concept").value;
      let saldo = parseInt(localStorage.getItem("saldo"), 10) || 0;

      if (!isNaN(monto) && monto > 0) {
        if (monto <= saldo) {
          saldo -= monto;
          localStorage.setItem("saldo", saldo);

          let historial = JSON.parse(localStorage.getItem("historial")) || [];
          historial.push({
            tipo: "Retiro",
            monto: monto,
            concepto: concepto,
            usuario: savedUser,
            fecha: new Date().toLocaleString(),
          });
          localStorage.setItem("historial", JSON.stringify(historial));

          alert("¡Retiro realizado con éxito!");
          window.location.href = "home.html";
        } else {
          alert("Saldo insuficiente para el retiro.");
        }
      } else {
        alert("Ingrese un monto válido.");
      }
    });
  }

  // Mostrar historial de transacciones
  let historial = JSON.parse(localStorage.getItem("historial")) || [];
  const tbody = document.querySelector("#historial-table tbody");

  if (tbody && historial.length > 0) {
    historial.reverse().forEach((tx, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${tx.tipo}</td>
      <td>${tx.monto}</td>
      <td>${tx.concepto || "-"}</td>
      <td>${tx.fecha || "-"}</td>
    `;
      tbody.appendChild(tr);
    });
  } else if (tbody) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="5">Sin transacciones registradas.</td>';
    tbody.appendChild(tr);
  }

  // Pago de servicios
  const serviciosForm = document.getElementById("servicios-form");
  if (serviciosForm) {
    serviciosForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const servicio = document.getElementById("servicio").value;
      const referencia = document.getElementById("referencia").value.trim();
      const monto = parseInt(document.getElementById("monto").value, 10);

      let saldo = parseInt(localStorage.getItem("saldo"), 10) || 0;

      if (!servicio || !referencia || isNaN(monto) || monto <= 0) {
        alert("Completa todos los campos correctamente.");
        return;
      }

      if (monto > saldo) {
        alert("No tienes saldo suficiente para realizar este pago.");
        return;
      }

      // Actualizar saldo
      saldo -= monto;
      localStorage.setItem("saldo", saldo);

      // Guardar la transacción en el historial
      let historial = JSON.parse(localStorage.getItem("historial")) || [];
      historial.push({
        tipo: "Pago servicio",
        concepto: servicio,
        referencia: referencia,
        monto: monto,
        usuario: savedUser,
        fecha: new Date().toLocaleString(),
      });
      localStorage.setItem("historial", JSON.stringify(historial));

      alert("¡Pago realizado con éxito!");
      window.location.href = "home.html";
    });
  }
});
